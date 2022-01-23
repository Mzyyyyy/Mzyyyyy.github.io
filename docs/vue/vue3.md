# 一

1. Vue1 一个属性一个 watcher，Vue2 控制 watcher 在组件层面（mount 方法时 observer(\_data)实现），组件内部使用虚拟 dom 更新，这样也可以保证虚拟 dom 不会过大
2. react 使用 fiber：通过浏览器渲每一帧渲染后的空闲时间进行虚拟 diff 的计算（浏览器在渲染后的空闲会触发 requestIdleCallback 并且把虚拟 diff 的计算以链表表示 dom 的形式进行，使其可以终止、继续
3. 组件之间的数据更新，是通过响应式去通知，组件内部没有响应式的 wathcer，而是通过虚拟 Dom 更新

# 二

1. vue 会把 template 编译成 render 函数
2. jsx 相对于 template 的优点：

   - 可以用任何 js 语法 如 ifelse 三元表达式来渲染 在动态渲染方面更灵活
   - 一个 jsx 可以导出多个组件，template

3. template 相对于 jsx 的优点

   - 编译后静态的标签和属性会放在 hoisted 变量中（render 函数外），会跳过 diff 算法，性能好

4. h 函数内部执行 createVNode，返回虚拟 dom，而 jsx 最终也解析为 createVNode
5. vue2 为什么对 TS 支持不太好：因为 vue2 中所有属性都挂在 this 上,this 类似一个黑盒，没法知道上面究竟有哪些属性
