# Single-spa

## 注册子应用

single-spa 中最重要的，也是加载应用最开始的，就是注册子应用的方法，如下：

```javascript
singleSpa.registerApplication({
  name: "taobao", // 子应用名
  app: () => System.import("taobao"), // 如何加载你的子应用
  activeWhen: "/appName", // url 匹配规则，表示啥时候开始走这个子应用的生命周期
  customProps: {
    // 自定义 props，从子应用的 bootstrap, mount, unmount 回调可以拿到
    authToken: "xc67f6as87f7s9d",
  },
});

singleSpa.start(); // 启动主应用
```

为什么使用 systemJS?

因为 single-spa 的设计理念是主应用尽可能简单轻量，最好是一个 html 加一个 js 文件，直接可以运行在浏览器里，但是浏览器没法 import 模块（script type="module" 可以）

但是，遇到导入模块依赖的，像 import axios from 'axios' 这样的，就需要 importmap 了：

```javascript
<script type="importmap">
    {
       "imports": {
          "vue": "https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js"
       }
    }
</script>

<div id="container">我是：{{name}}</div>

<script type="module">
  import Vue from 'vue'

  new Vue({
    el: '#container',
    data: {
      name: 'Jack'
    }
  })
</script>

```

总之 SystemJS 是为了在浏览器里使用 ES6 的模块方案。

## 子应用生命周期

子应用需要在app()中导出三个生命周期钩子函数：

```js
export const bootstrap = () => {};
export const mount = () => {};
export const unmount = () => {};
```
