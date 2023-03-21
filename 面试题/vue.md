01. vue 三大核心
    - 响应式（双向驱动）：监听 data 属性，getter / setter
    - 模版编译：with语法；模版编译为 render 函数；执行 render 函数生成 vnode
    - vdom：path(elem, vnode) 和 path(vnode, newVnode)



02. vue 特点
    - 单页面
    - 渐进式
    - 组件化
    - 虚拟dom
    - 双向驱动
        - 核心是 VM，是 M和V 之间的调度者。M和V不直接关联，通过中间的VM。
    
    渐进式：把注意力集中保持在核心库，本身 vue 就是 vue.js，随着项目的壮大，需要安装更多依赖/插件
    
    - 模拟 dom
    ```js
        // 真实的DOM
        <div class="a" id="b">我是内容</div>

        // 虚拟DOM
        {
            tag: 'div',        // 元素标签
            attrs: {           // 属性
                class: 'a',
                id: 'b'
            },
            text: '我是内容',    // 文本内容
            children: []       // 子元素
        }
    ```
    - 虚拟 DOM 实现原理，包括以下 3 部分：
        1. 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
        2. diff 算法 — 比较两棵虚拟 DOM 树的差异；
        3. pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。



03. vue 组件渲染过程
    - 模版编译为 render 函数，执行 render 函数返回 vnode
    - 基于 vnode 再执行 patch 和 diff
    - 使用 webpack vue-loader，会在开发环境下编译模版
    - 在 vue 的整个渲染过程中 render 函数和 template 是一个上下级的关系
    - 过程：template => render() => vnode => patch => node



04. vue-loader（提取器/中转器）
    - 一个 webpack 的 loader 用来解析和转换 vue 文件，
        提取出其中的 script、style、template，再把他们交给对应 loader 处理
    - 特性： 1. 允许 vue 组件每个部分使用对应 loader
            2. 允许 vue 文件中使用自定义模块和自定义 loader
            3. 将 style 和 template 中引用的资源当作依赖处理，为每个组件模拟 scope
            4. 允许使用热重载
    - 使用场景：
            1. 编译 template，将编译用坐 vue 的 template 选项，url 转换成 webpack 的模块请求
            2. 调用预处理，sass/less/postcss
            3. 允许使用热重载



05. 组件渲染/更新过程
    - 初次渲染
        - 解析模版为 render 函数（或在开发环境已完成，vue-loader）
        - 触发响应式，监听 data 属性，getter / setter
        - 执行 render 函数，生成 vnode，patch(elem, vnode)
    - 更新渲染
        - 修改 data，触发 setter（此前在 getter 中已被监听）
        - 重新执行 render 函数，生成 newVnode
        - path(vnode, newVnode)
    - 异步渲染
        - 回顾 $nextTick 
        - 汇总 data 的变化，一次性更新视图
        - 减少 dom 操作次数，提高性能（dom 操作会重新 render，所以效率低）



06. Vite - npm init @vitejs/app
    - 配置简单，原生支持 jsx、ts、tsx、scss，无需单独配置
    - Vite 内部引入包是使用 ES Modules 的方式，对于主流的浏览器现在都是支持的，
      在 script 添加 type="module" 即可
    - Vite 在开发模式下不需要打包可直接运行，运行速度比较快；Vue-Cli 在开发模式下，
      必须打包才能运行项目。
    - 在生产环境下 Vite 使用 Rollup 打包，基于浏览器原生的 ESModules 打包，不用使用 babel 将 import 转化成 require 以及一些辅助函数，打包体积会小一些。而 Vue-CLI 使用 Webpack 进行打包。



07. rollup - 阮一峰 - https://www.ruanyifeng.com/blog/2022/05/rollup.html
    - rollup.js 的开发本意，是打造一款简单易用的 ES 模块打包工具，不必配置，直接使用。它确实做到了。
    - 经过不断发展，它也可以打包 CommonJS 模块。但需要经过复杂配置，实际上并没有比 Webpack 简单多少。
    - 因此建议，只把 rollup.js 用于打包 ES 模块，这样才能充分发挥它的优势。
    - 如果你的项目使用 CommonJS 模块，不推荐使用 rollup.js，优势不大。

    - 特点：https://www.bilibili.com/video/BV1w84y1z77V
        1. 默认只能处理 ES module 模块
        2. 最早提出 tree shaking 的概念
        3. 可以打包 CommonJS 但没有优势，要依赖插件
        4. 与 webpack 作用相似，比 webpack 要小巧的多
        5. 本意是为打包 ES 而生，并不是与 webpack 竞争
        6. 默认只能按照‘文件路径’加载本地文件模块，不能直接通过模块名称导入，要依赖插件才可以



08. 路由钩子
    - 全局钩子： beforeEach(全局前置守卫)、 afterEach(全局后置钩子)
    - 路由独享的守卫(单个路由里面的钩子)： beforeEnter
    - 组件路由：beforeRouteEnter、 beforeRouteUpdate、 beforeRouteLeave



09. Vue 实例挂载的过程中做了什么
    1. new Vue的时候调用会调用 _init 方法
        - 定义 $set、 $get 、$delete、$watch 等方法
        - 定义 $on、$off、$emit、$off 等事件
        - 定义 _update、$forceUpdate、$destroy生命周期
    2. 调用 $mount 进行页面的挂载
    3. 挂载的时候主要是通过 mountComponent 方法
    4. 定义 updateComponent 更新函数
    5. 执行 render 生成虚拟 DOM
    6. _update 中 patch函数 将虚拟 DOM 生成真实 DOM 结构，并且渲染到页面中



10. 为什么 data 属性是一个函数而不是一个对象
    - 组件中定义 data 属性，只能是一个函数，防止多个组件实例共用一个 data
        - 定义组件的时候，vue 最终都会通过 Vue.extend() 构成组件实例
        - 组件创建时会进行选项合并，自定义组件会进入 mergeOptions 进行合并
        - 采用函数的形式，initData 时会将其作为工厂函数都会返回全新 data 对象
    - vue 实例的 data 既可以是对象，也可以是函数（根实例是单例），不会产生数据污染情况
    


11. vue ‘组件’ 和 ‘插件’的区别
    1. 插件通常用来为 Vue 添加全局功能
        - 添加全局方法或者属性。如: vue-custom-element
        - 添加全局资源：指令/过滤器/过渡等。如 vue-touch
        - 通过全局混入来添加一些组件选项。如 vue-router
        - 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现
        - 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router
    2. 插件两者的区别
        - 编写形式：暴露 install 方法，第一个参数是 Vue 构造器，第二个参数是一个可选的对象
        - 注册形式：通过 Vue.use 方式注册，第一个参数为插件名字，第二个参数是可选择的配置项
        - 使用场景：组件 (Component) 是用来构成 App 的业务模块，它的目标是 App.vue
                    插件 (Plugin) 是用来增强技术栈的功能模块，它的目标是 Vue 本身
                    简单来说，插件就是指对 Vue 的功能的增强或补充，类似 jQuery 的 extends



12. Vue 中的 key 有什么作用？
    - key 是 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速
    - 如果不用 key，Vue 会采用就地复地原则：最小化 element 的移动，并且会尝试尽最大程度在同适当的地方对相同类型的 element，做 patch 或者 reuse
    - 如果使用了 key，Vue 会根据 keys 的顺序记录 element，曾经拥有了 key 的 element 如果不再出现的话，会被直接 remove 或者 destoryed



13. vue3.0 特性
    - 多节点
    - 新增瞬移组件
    - 生命周期变化
    - composition API
    - 动态节点、静态提升、时间缓存、节点正相关
    - Proxy - 支持 Map、Set、WeakMap 和 WeakSet
    - 默认采用惰性观察 - 只观察用于渲染应用程序最初可见部分的数据
    - 插槽改成了函数，只影响子组件重新渲染，提升了渲染性能 - 父组件更新不再 render 子组件



14. 父子组件生命周期执行顺序
    - 挂载阶段：父beforeMount -> 子beforeCreate -> 子created -> 子beforeMount -> 子mounted -> 父mounted
    - 执行顺序为：父beforeUpdate -> 子beforeUpdate -> 子updated -> 父updated
    - 执行顺序为：父beforeDestroy -> 子beforeDestroy -> 子destroyed -> 父destroyed



15. spa 单页应用优缺点
    - 优点：
        - 良好的前后端分离，分工更明确
        - 具有桌面应用的即时性、网站的可移植性和可访问性
        - 用户体验好、快，内容的改变不需要重新加载整个页面
    - 缺点：
        - 不利于搜索引擎的抓取
        - 首次渲染速度相对较慢
            - 加载慢的原因
                1. 网络延时问题
                2. 资源文件体积是否过大
                3. 资源是否重复发送请求去加载了
                4. 加载脚本的时候，渲染内容堵塞了
            - 解决方案 - 项目优化层面
                1. 使用 SSR
                2. GZip 压缩
                    - cnmp i compression-webpack-plugin -D
                3. 减小入口文件积
                    - component: () => import('./components/load.vue')
                4. 图片资源的压缩
                5. UI 框架按需加载
                    - import { Button } from 'element-ui';
                6. 组件重复打包 
                    - minChunks: 3，使用 3 次以上的包抽离公共依赖文件，避免重复加载

    - hash
        - window.addEventListener('hashchange', this.refresh, false);  
    - history
        - history.pushState 浏览器历史纪录添加记录
        - history.replaceState 修改浏览器历史纪录中当前纪录
        - history.popState 当 history 发生变化时触发



16. diff 优化时间复杂度到O(n)
    - 同级比较，不跨级比较
    - tag 不同则直接删除重建，不再深度比较
    - tag 和 key 两者都相同，则认为节点相同，不再深度比较
    - 都有 chil 则对比；新 ch 有值，旧 ch 无值则添加；新无旧有则删除
    - 开始和开始；结束和结束；开始和结束；结束和开始

    - 同级对比，从两端向中间，通过 key 判断是否出现变化
    - 层级：只考虑单层复用，多层级遍历实现
    - 顺序：双向指针，首尾向中间移动
    - 替换：移动、新增、删除，优先复用

    - 区分静动态节点，只遍历动态节点，Vue2中，据发生变化就会生成新DOM树，全量的比较
    - Vue3 创建虚拟 DOM 树的时候，会根据 DOM 中的内容会不会发生变化，添加一个静态标记。只会对比这些带有静态标记的节点



17. vdom
    - vdom 存在的价值：数据驱动视图，控制 dom 操作
    - h 函数返回的是 vnode，createElement 也一样
    - vdom：path(elem, vnode) 和 path(vnode, newVnode)



18. 路由
    - hash
        - window.addEventListener('hashchange', {})，监听 hash 变化
    - history
        - window.history.pushState，不会刷新页面
        - window.history.replaceState，不会刷新页面
        - window.addEventListener('popstate', {})，监听浏览器前进后退



19. keep-alive
    ```js
        <div id="app" class='wrapper'>
            <keep-alive>
                <!-- 需要缓存的视图组件 --> 
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <!-- 不需要缓存的视图组件 -->
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
    ```
    - 缓存后如何获取数据
        1. beforeRouteEnter
        2. actived - SSR avtived 不被调用
    - 首次进入组件时：beforeRouteEnter > beforeCreate > created > mounted 
                    > activated > ... > beforeRouteLeave > deactivated
    - 再次进入组件时：beforeRouteEnter >activated > ... > 
                   beforeRouteLeave > deactivated



20. 修饰符
    - 键盘修饰符
        1. 系统修饰键（ctrl、alt、meta、shift...）
        2. 普通键（enter、tab、delete、space、esc、up...）
    - 鼠标按钮修饰符
        1. left 左键点击
        2. right 右键点击
        3. middle 中键点击
    - v-bind 修饰符
        1. async - 对 props 进行一个双向绑定
        2. prop - 设置自定义标签属性，避免暴露数据，防止污染 HTML 结构
        3. camel - 将命名变为驼峰命名法，如 view-Box 转换为 viewBox
    - 表单修饰符
        1. lazy - <input type="text" v-model.lazy="value"> 光标离开标签
        2. trim - 自动过滤用户输入的首空格字符，中间的空格不会过滤
        3. number - 自动转为数值类型，如果无法被 parseFloat 解析，返回原来的值
    - 事件修饰符
        1. stop - 阻止事件冒泡，相当于 event.stopPropagation 方法
        2. prevent - 阻止默认行为，相当于 form 得 event.preventDefault
        3. self - 只当在 event.target 是当前元素自身时触发处理函数
        4. once - 只触发一次
        5. caption - 用于事件捕获
        6. capture - 使事件触发从包含这个元素的顶层开始往下触发
        7. passive - 移动端监听元素滚动，一直触发 onscroll 变卡，相当于给 scroll .lazy
        8. native - <my-component v-on:click.native="doSomething"></my-component>
                    像 html 监听根元素的原生事件，否则组件上使用 v-on 只会监听自定义事件



21. 自定义指令
    - 注册一个自定义指令有全局注册与局部注册
    - 全局注册注册主要是用过 Vue.directive 方法进行注册
    - Vue.directive 第一个参数是指令的名字（不需要写上v-前缀），第二个参数可以是对象数据，也可以是一个指令函数
    ```js
        // 局部注册在组件 options 中设置 directive 
        directives: {
            focus: {
                // 指令的定义
                inserted: function (el) {
                el.focus() // 页面加载完成之后自动让输入框获取到焦点的小功能
                }
            }
        }

        // 注册一个全局自定义指令 `v-focus`
        Vue.directive('focus', {
            // 当被绑定的元素插入到 DOM 中时……
            inserted: function (el) {
                // 聚焦元素
                el.focus()  // 页面加载完成之后自动让输入框获取到焦点的小功能
            }
        })
    ```
    - 自定义指令也像组件那样存在'钩子'函数
        1. bind：只调用一次，指令第一次绑定到元素时调用，在这里可以进行一次性的初始化设置
        2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
        3. update：所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前
        4. componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
        5. unbind：只调用一次，指令与元素解绑时调用
    - 应用场景
        1. 防抖
        ```js
            // 1.设置 v-throttle 自定义指令
            Vue.directive('throttle', {
                bind: (el, binding) => {
                    let throttleTime = binding.value; // 防抖时间
                    // 用户若不设置防抖时间，则默认2s
                    if (!throttleTime) throttleTime = 2000;
                    let _callback;
                    el.addEventListener('click', event => {
                        if (!_callback) { // 第一次执行
                            _callback = setTimeout(() => {
                                _callback = null;
                            }, throttleTime);
                        } else {
                            event && event.stopImmediatePropagation();
                        }
                    }, true);
                }
            });
            // 2.为 button 标签设置 v-throttle 自定义指令
            <button @click="sayHello" v-throttle>提交</button>
        ```
        2. 图片懒加载
        3. 一键 Copy 的功能
            - https://github.com/febobo/web-interview/issues/21



22. Observable 是什么
    - Vue.observable，让一个对象变成响应式数据。Vue 内部会用它来处理 data 函数返回的对象



23. props 和 data 优先级谁高
    props ==> methods ==> data ==> computed ==> watch



24. 谈一下 MVVM
    - 见 Vue源码 / 理论.md



25. dist 包太大怎么办
    - https://www.bilibili.com/video/BV1aR4y1M7Yd/



26. ref() 和 reactive() - https://juejin.cn/post/7211055301205934138
    - 区别在于：ref可以同时处理基本数据类型和对象，而reactive只能处理处理对象而支持基本数据类型。
        - const numberRef = ref(0);           // OK
        - const objectRef = ref({ count: 0 }) // OK
        // TS2345: Argument of type 'number' is not assignable to parameter of type 'object'.
        - const numberReactive = reactive(0);
        - const objectReactive = reactive({ count: 0}); // OK
    
    - 这是因为二者响应式数据实现的方式不同：
        - ref 是通过一个中间对象 RefImpl 持有数据，并通过重写它的 set 和 get 方法实现数据劫持的，
        本质上依旧是通过 Object.defineProperty 对 RefImpl 的 value 属性进行劫持。
        - reactive 则是通过 Proxy 进行劫持的。Proxy 无法对基本数据类型进行操作，导致对基本数据类型束手无策。
