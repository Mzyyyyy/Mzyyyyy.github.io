# single-spa 


![single-spa.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90696bfd17824a8bb8c7a977af92e22a~tplv-k3u1fbpfcp-watermark.image?)

```本文需结合single-spa源码食用，如上图，其大致实现方向为应用注册、应用更新、路由监听三个主要功能```

[single-spa源码地址](https://github.com/single-spa/single-spa)

## 应用状态
为了更直观体现，我把所有子应用状态先抽离出来放在前面，方便后面的使用。
```js
const NOT_LOADED = 'NOT_LOADED' // 未加载/待加载
// 未加载(待加载)每个子应用的默认状态，意味着主应用还没有获取到子应用的 bootstrap、mount、unmount、unload 方法。

const LOAD_SOURCE_CODE = 'LOAD_SOURCE_CODE' // 加载源代码
// 在这个阶段，single-spa 会执行子应用注册时提供的 loadApp 方法，去动态获取子应用的入口 js 文件，然后执行，得到子应用的 bootstrap、mount、unmount、unload 方法。

const NOT_BOOTSTRAPPED = 'NOT_BOOTSTRAPPED' // 未启动/待启动
// 得到子应用的 bootstrap、mount、unmount、unload、update 方法以后，single-spa 会将这些方法添加到子应用对象中。 添加完毕以后，子应用的状态就变为 not_bootstrapped，等待被启动。

const BOOTSTRAPPING = 'BOOTSTRAPPING'  // 子应用启动中
// 子应用被激活以后，就会进入 BOOTSTRAPPING 阶段。此时如果子应用提供了 bootstrap 方法，那么 bootstrap 方法就会触发。

const NOT_MOUNTED = 'NOT_MOUNTED' // 未挂载/待挂载
// 子应用启动以后，自动进入 NOT_MOUNTED 阶段。

const MOUNTING = 'MOUNTING' // 子应用挂载中
// 在这个阶段，自动触发子应用提供的 mount 方法。

const MOUNTED = 'MOUNTED' // 子应用已挂载
// 子应用挂载完毕，子应用的状态变为 MOUNTED。

const UNMOUNTING = 'UNMOUNTING' // 正在挂载
// 如果一个子应用需要被卸载，那么这个子应用的状态就会变为 UNMOUNTING。
// 此时，子应用的 unmount 方法会执行。

const UNMOUNTED = 'UNMOUNTED' // 卸载完毕
// 子应用卸载完毕以后，子应用的状态就会变为 UNMOUNTED。

const LOAD_ERROR = 'LOAD_ERROR'  // load失败
// 子应用加载失败，子应用的状态就会变为 LOAD_ERROR。
```

```从最直接被使用的两个方法入手：子应用的注册和基座应用的启动```

## 应用注册（registerApplication）
- 应用注册方法主要是对子应用参数进行格式化后，将子应用放入应用列表中，并把应用状态初始化为`NOT_LOADED`
```js
const apps = []

function registerApplication(appName,appLoadFn,activeWhen,customProps){
    const app = {
        appName, // 子应用名
        appLoadFn, // 子应用加载方式
        activeWhen, // 子应用激活匹配规则
        customProps // 自定义props
    }
    apps.push(
        {
            status: NOT_LOADED,
            ...app
        }
    )
    // reroute方法主要用于更新应用状态并完成加载卸载操作，具体实现在后面
    reroute()
}
```

## 基座应用启动(start)
- 这里比较简单，只需要对基座唯一状态值进行更改
```js 
// const apps = []
let isStarted = false

function start(){
    isStarted = true
}
// function registerApplication(appName,appLoadFn,activeWhen,customProps){
//  ...
// }
```

## 更新应用相关(reroute)
- reroute方法是对更改所有需要更改的应用状态，并执行对应操作（该挂载的挂载，该卸载的卸载，改为他应该处在的状态）,其实就是url改变后需要做的操作。
```js
function reroute(){
    // 首先要遍历所有子应用，并进行归类，分为4类：待加载、待移除、待挂载、待卸载
    const {
        appsToLoad
        appsToMount
        appsToUnmount
        // appsToUnload
    } = getApps()

    // 对所用应用进行归类后，就可以对其进行分别处理
    if(!isStarted){ 
        appsToLoad.map(toLoad) // 这里可见应用没启动时已经会对所用子应用进行load加载
    }else{
        // 只有当基座应用启动了才会进行子应用的挂载，否则只需要对子应用进行内容的加载/卸载即可
        appsToMount.map(tryBootstrapAndMount)
        appsToUnmount.map(toUnMount)
    }

    /**
     * 子应用加载方法,必须最先加载应用
     */
    async function toLoad(app){
        app.status = LOAD_SOURCE_CODE
        // 从app的加载函数中导出生命周期钩子方法
        let {
            bootstrap,
            mount,
            unmount,
            unload
        } = await app.appLoadFn()
        app.status = NOT_BOOTSTRAPPED
        // 并将所有钩子直接挂在app上，方便后续使用，下文已用TODO标注使用的地方
        app.bootstrap = bootstrap
        app.mount = mount
        app.unmount = unmount
        app.unload = unload
    }

    /**
     * 子应用挂载方法
     */
    async function tryBootstrapAndMount(app){
        // 定义一个状态判断当前url是否匹配当前应用，匹配则需要激活当前应用 
        const shoudBeActive = app.activeWhen(window.location)
        if(shoudBeActive){
            app.status = BOOTSTRAPPING 
            await app.bootstrap(app.customProps)   // ！！！TODO 这里用到了应用的第一个方法：bootstrap
            app.status = NOT_MOUNTED // 此时子应用启动完成

            if(shoudBeActive){ 
                // 因为有异步操作，需要再二次判断，防止在异步加载过程中用户手动切换url导致挂载错误
                app.status = MOUNTING
                await app.mount(app.customProps) // ！！！TODO 这里用到了应用的第二个方法：mount
                app.status = MOUNTED
            }
        }
    }
    /**
     * 子应用卸载方法
     */
    async function toUnmount (app) {
        if (app.status !== MOUNTED) return
        app.status = MOUNTING
        await app.unmount(app.customProps) // // ！！！TODO 这里用到了应用的第三个方法：unmount
        app.status = NOT_MOUNTED
        return app
    }
}

function getApps(){
    // 待加载、待移除、待挂载、待卸载应用数组
    const appsToLoad = []
    const appsToUnload = []
    const appsToMount = []
    const appsToUnmount = []
    
    apps.forEach((app)=>{
        // 定义一个状态判断当前url是否匹配当前应用，匹配则需要激活当前应用，这里可以抽成公共方法判断，为了更易阅读，这里重新定义
        const shoudBeActive = app.activeWhen(window.location) 

        switch (app.status) {
            case NOT_LOADED: // 状态为NOT_LOADED时只有url匹配才要load应用所以shoudBeActive时加到待加载数组中
                if(shoudBeActive){
                    appsToLoad.push(app)
                }
                break;
            case NOT_BOOTSTRAPPED:
            case NOT_MOUNTED: // 当加载完后，需要激活时才将应用放入待挂载数组重
                if(appShouldBeActive){
                    appsToMount.push(app);
                } 
                // else {
                //     appsToUnload.push(app); // 这里的移除操作不影响主流程的实现，顾不做深入
                // }
                break;
            case MOUNTED:
                if(!appShouldBeActive){ // 当应用已经挂在，并且不需要激活当前应用时，加入待卸载数组中等待卸载
                    appsToUnmount.push(app)
                }
                break;
            default:
                break;
        }
    })
    return { appsToLoad, appsToUnload, appsToMount, appsToUnmount };
}
```

## 路由监听
- 截止目前，我们已经做好了所有应用的相关操作：子应用的加载、以及路由变化后所做的挂载、卸载等，还剩下最后一步路由的监听，只有监听了路由的改变，我们的single-spa才能对子应用执行相应的操作

```js
    // 监听window的hashchange、popstate两个事件，一旦url改变执行reroute操作
    window.addEventListener("hashchange", reroute);
    window.addEventListener("popstate", reroute);

    // 下面是对window history相关事件的增强，主要是在其方法内添加reroute的执行
    window.history.pushState = patchedUpdateState(
        window.history.pushState,
        "pushState"
    );
    window.history.replaceState = patchedUpdateState(
        window.history.replaceState,
        "replaceState"
    );

    // 该方法用于对window.history事件的包装
    function patchedUpdateState(){
        return function () {
            const urlBefore = window.location.href;
            const result = updateState.apply(this); // 这里是维持执行原来的事件内容并拿到返回值
            const urlAfter = window.location.href;

            if (urlBefore !== urlAfter) {
                // 变更前后url不一样 则出发reroute
                reroute
            }
            return result;
        }
    }
```

## 结束

上文只是大致实现了一个极简版single-spa，不难看出，其本质上是一个加载器（控制子应用加载、卸载等功能的应用）和状态机（更改应用状态）的结合体。在项目中，往往还需要配合single-spa-vue来使用，下一篇文章我将简单实现一下single-spa-vue的功能。