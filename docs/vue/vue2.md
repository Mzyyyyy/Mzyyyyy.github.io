# vue-loader 是怎么兼容 webpack 的 HMR 的

## vue-loader 关闭热重载

这个特性之前漏掉了

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          hotReload: false, // 关闭热重载
        },
      },
    ],
  },
};
```

## hot-reload api 解析

我们可以从 vue-loader 的解析函数中看到，

```javascript
// vue-loader/lib/index.js
const needsHotReload =
  !isServer &&
  !isProduction &&
  (descriptor.script || descriptor.template) &&
  options.hotReload !== false;
```

这里判断了是否编译的目标非 server、非生产者，且 vue 组件中 script 或 template 存在，最后一步查看是否配置了 hotReload = true（默认开启）

```javascript
// vue-loader/lib/index.js 178行
if (needsHotReload) {
  code += `\n` + genHotReloadCode(id, hasFunctional, templateRequest);
}

// vue-loader/lib/codegen/hotReload.js
const hotReloadAPIPath = JSON.stringify(require.resolve("vue-hot-reload-api"));

const genTemplateHotReloadCode = (id, request) => {
  return `
    module.hot.accept(${request}, function () {
      api.rerender('${id}', {
        render: render,
        staticRenderFns: staticRenderFns
      })
    })
  `.trim();
};

exports.genHotReloadCode = (id, functional, templateRequest) => {
  return `
    /* hot reload */
    if (module.hot) {
      var api = require(${hotReloadAPIPath})
      api.install(require('vue'))
      if (api.compatible) {
        module.hot.accept()
        if (!api.isRecorded('${id}')) {
          api.createRecord('${id}', component.options)
        } else {
          api.${functional ? "rerender" : "reload"}('${id}', component.options)
        }
        ${templateRequest ? genTemplateHotReloadCode(id, templateRequest) : ""}
      }
    }
      `.trim();
};
```

如果开启的 hotReload，此时就会在 vue 文件中注入这个 if 分支。其实就是用到了 webpack 的 module.hot - API。 在./index.vue 例子中，三个参数分别是 id: string, functional: boolean, templateRequest: string 我们经常用到的是：id 就代表该 SFC 文件的 hash 值，templateRequest 则是代表这个组件的 template 块。

从代码中我们可以看到这个常量：hotReloadAPIPath，他就是一个绝对地址指向 hotReloadAPI 模块。 我们看下这些个 if、else 语句。

假设 api.compatible = true 可以看到 api 这个对象会记录本文件的 id，否则就调用 api 的 reload 或 rerender 函数。 但始终会在 module.hot.accept 中注册回调函数。该匿名函数动态生成，因为 template-block 以及 id 每次都是不同的并调用 rerender 函数。

## hot-reload-api

我们 api.compatible 这个实际上是在 install 的时候确认了下 vue 的版本。在确定是否可支持热更新。接下去看

在 createReocord 过程中

```javascript
// vue-hot-reload-api
exports.createRecord = function (id, options) {
  if (map[id]) {
    return;
  }

  var Ctor = null;
  if (typeof options === "function") {
    Ctor = options;
    options = Ctor.options;
  }
  makeOptionsHot(id, options);
  map[id] = {
    Ctor: Ctor,
    options: options,
    instances: [],
  };
};

function makeOptionsHot(id, options) {
  if (options.functional) {
    var render = options.render;
    options.render = function (h, ctx) {
      var instances = map[id].instances;
      if (ctx && instances.indexOf(ctx.parent) < 0) {
        instances.push(ctx.parent);
      }
      return render(h, ctx);
    };
  } else {
    injectHook(options, initHookName, function () {
      var record = map[id];
      if (!record.Ctor) {
        record.Ctor = this.constructor;
      }
      record.instances.push(this);
    });
    injectHook(options, "beforeDestroy", function () {
      var instances = map[id].instances;
      instances.splice(instances.indexOf(this), 1);
    });
  }
}

function injectHook(options, name, hook) {
  var existing = options[name];
  options[name] = existing
    ? Array.isArray(existing)
      ? existing.concat(hook)
      : [existing, hook]
    : [hook];
}
```

其实这里主要的逻辑是利用了 vue 组件的生命周期，beforeCreate 和 beforeDestroy Hook。在其中注册了一个 callback 函数，在创建的时候加入到 map.instance 中，销毁的时候把它移除。

```javascript
#reload
exports.reload = tryWrap(function (id, options) {
  var record = map[id]
  if (options) {
    if (typeof options === 'function') {
      options = options.options
    }
    makeOptionsHot(id, options)
    if (record.Ctor) {
      if (version[1] < 2) {
        // preserve pre 2.2 behavior for global mixin handling
        record.Ctor.extendOptions = options
      }
      var newCtor = record.Ctor.super.extend(options)
      // prevent record.options._Ctor from being overwritten accidentally
      newCtor.options._Ctor = record.options._Ctor
      record.Ctor.options = newCtor.options
      record.Ctor.cid = newCtor.cid
      record.Ctor.prototype = newCtor.prototype
      if (newCtor.release) {
        // temporary global mixin strategy used in < 2.0.0-alpha.6
        newCtor.release()
      }
    } else {
      updateOptions(record.options, options)
    }
  }
  record.instances.slice().forEach(function (instance) {
    if (instance.$vnode && instance.$vnode.context) {
      instance.$vnode.context.$forceUpdate()
    } else {
      console.warn(
        'Root or manually mounted instance modified. Full reload required.'
      )
    }
  })
})
```

这条语句 instance.$vnode.context.$forceUpdate()就能说明一切了，所有这个 SFC 文件的 instance 全部强制更新。值得注意一提的是，是本实例 vnode 下 context 编译上下文，这个是父组件别弄错了。

那我们修改一次 SFC 文件试试看

仅修改 script-block 因为 sfc 文件修改了，所以 vue-loader 重新编译该文件。此时 id 和之前一样吗，是一样的因为它的文件名称之类的信息都没改遍。内容相同，通过 hash 函数计算，就相当于是校验了文件信息的完整性了
为什么要重新执行 makeOptionsHot 函数，因为此时的 options 是一个新的对象，我们得重复的做一遍操作。因为销毁这个组件的时候，还是要移除相关的钩子的。

随后实际上就是保留原先的相关实例，产生新的组件 cid 等

```javascript
var newCtor = record.Ctor.super.extend(options);
// prevent record.options._Ctor from being overwritten accidentally
newCtor.options._Ctor = record.options._Ctor;
record.Ctor.options = newCtor.options;
record.Ctor.cid = newCtor.cid;
record.Ctor.prototype = newCtor.prototype;
```

修改 template-block

```javascript
exports.rerender = tryWrap(function (id, options) {
  var record = map[id];
  if (!options) {
    record.instances.slice().forEach(function (instance) {
      instance.$forceUpdate();
    });
    return;
  }
  if (typeof options === "function") {
    options = options.options;
  }
  if (record.Ctor) {
    record.Ctor.options.render = options.render;
    record.Ctor.options.staticRenderFns = options.staticRenderFns;
    record.instances.slice().forEach(function (instance) {
      instance.$options.render = options.render;
      instance.$options.staticRenderFns = options.staticRenderFns;
      // reset static trees
      // pre 2.5, all static trees are cached together on the instance
      if (instance._staticTrees) {
        instance._staticTrees = [];
      }
      // 2.5.0
      if (Array.isArray(record.Ctor.options.cached)) {
        record.Ctor.options.cached = [];
      }
      // 2.5.3
      if (Array.isArray(instance.$options.cached)) {
        instance.$options.cached = [];
      }

      // post 2.5.4: v-once trees are cached on instance._staticTrees.
      // Pure static trees are cached on the staticRenderFns array
      // (both already reset above)

      // 2.6: temporarily mark rendered scoped slots as unstable so that
      // child components can be forced to update
      var restore = patchScopedSlots(instance);
      instance.$forceUpdate();
      instance.$nextTick(restore);
    });
  } else {
    // functional or no instance created yet
    record.options.render = options.render;
    record.options.staticRenderFns = options.staticRenderFns;

    // handle functional component re-render
    if (record.options.functional) {
      // rerender with full options
      if (Object.keys(options).length > 2) {
        updateOptions(record.options, options);
      } else {
        // template-only rerender.
        // need to inject the style injection code for CSS modules
        // to work properly.
        var injectStyles = record.options._injectStyles;
        if (injectStyles) {
          var render = options.render;
          record.options.render = function (h, ctx) {
            injectStyles.call(ctx);
            return render(h, ctx);
          };
        }
      }
      record.options._Ctor = null;
      // 2.5.3
      if (Array.isArray(record.options.cached)) {
        record.options.cached = [];
      }
      record.instances.slice().forEach(function (instance) {
        instance.$forceUpdate();
      });
    }
  }
});
```

另外一个 SFC 文件，会被分成 template-block、script-block。如果是 template-block 改动了，webpack 会只请求该模块。

这种情况下即组件的 render 函数被修改了，所以需要替换组件中的 render 函数。和之前 script-block 区别不同的是，因为本组件只是更新了 render 函数，所以只要本组件强制刷新即可。

## 总结

可以看到 vue 文件中根据配置自动注入了一些 hotreload-API，这个 API 的原理就是在运行时中增加一个中介者对象，里面存放了文件的 id，和相关 instance（这个实例是通过 vue 组件的生命周期注册的）。等到文件改动时，根据变动的 block，选择不同的策略渲染$forceUpdate。

## Q

vue 是怎么做到只更新一个模块的，例如 template-block 更新了，只去获取 template 的模块 这个本质上我觉得就是 webpack-hot-module 做的事了，就跟某个模块更新一样，它会对比这个文件是否有改动（通过 hash 值）。
