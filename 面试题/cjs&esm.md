# https://www.zhihu.com/question/20351507
# https://juejin.cn/post/7212503883263787064

### 时间轴：CommonJS --> AMD --> CMD --> ES Module

- CommonJS - BravoJS 推广过程中对模块定义的规范化产出
    1. 常用于：服务器端，node，webpack
    2. 特点：同步/运行时加载，磁盘读取速度快
    3. 语法：module.exports => require
    4. exports 与 module.exports 指向同一个内存
    5. 核心思想：将每个文件都看作一个模块，每个模块都有自己的作用域，其中的变量、函数和对象都是私有的，不能被外部访问。要访问模块中的数据，必须通过 exports 和 require 的方式

- AMD - RequireJS 推广过程中对模块定义的规范化产出
    1. 常用于：不常用，CommonJs 的浏览器端实现
    2. 异步加载：面向浏览器端，为了不影响渲染肯定是异步加载
    3. 依赖前置：所有依赖必须写在最初的依赖数组中，速度快但浪费资源，不管是否用到
    4. 语法：define => require

- CMD - SeaJS 推广过程中对模块定义的规范化产出
    1. 常用于：不常用，根据 CJs 和 AMD 实现，优化了加载方式
    2. 异步加载
    3. 按需加载/依赖就近：用到了再引用依赖，方便了开发，缺点是速度和性能较差
    4. 语法：define => require

- ES module
    1. 常用于：目前浏览器端的默认标准
    2. 静态编译：在编译的时候就能确定依赖关系，以及输入和输出的变量
    3. 兼容：转码 ES5 再执行，import 语法会被转码为 require/exports
    4. 语法：export / export default => import

- 区别
    1. CJs 是运行时加载，ESM 是编译时加载
    2. AMD 推崇依赖前置，CMD 推崇依赖就近；RequireJS 2.0 也可以延迟执行
    3. require 是赋值过程（可改），import 是解构过程
    4. module.exports/require 是值的拷贝，export/import 是值的引用



### webpack 中的 Module 是指什么

- webpack 支持 ESModule, CommonJS, AMD, Assets(image, font, video, audio, json)
    1. ESM
        - 关键字 export 允许将 ESM(ESModule) 中内容暴露给其他模块
        - 关键字 import
        - package.json 
        - type: module -> 强制让 package.json 下的所有文件全都使用 ESMdule
        - type: commonjs -> 强制让 package.json 下的所有文件全都使用 CommonJS
    2. CommonJS 
        - module.exports: 允许将 CommonJS 中的内容暴露给其他模块
        - 通过 require 方式引入其他模块内容
        - node 中使用，浏览器不能用，因为不支持 module.exports
    3. 不同
        - cjs 是运行时加载，esm 是编译时加载



### webpack moudles 如何表达各种依赖关系
    * CommonJS：module.exports => require
    * AMD define require
    * CMD define require
    * ESM：export => import
    * css/sass/less @import



### require 和 import 的区别
- node 编程中最重要的思想就是模块化，import 和 require 都是被模块化所使用
    - 遵循规范：
        - require 是 AMD 规范引入方式
        - export/import是 ES6 的一个语法标准，需要兼容转化成 ES5 的语法
    - 调用时间：
        - export/import 是编译时调用，所以必须放在文件开头
        - require 是运行时调用，所以 require 理论上可以运用在代码的任何地方
    - 本质：
        - require 是赋值过程。module.exports 的内容是什么，require 结果就是什么，相当于module.exports 的传送门
        - import 是解构过程，但是目前所有的引擎都还没有实现 import，我们在 node 中使用 babel 支持ES6，也仅仅是将 ES6 转码为 ES5 再执行，import 语法会被转码为 require
    - module.exports/require 输出的是一个值的拷贝，export/import 模块输出的是值的引用

    - ***
        - require 是 AMD，import 是 es6
        - require 是运行时，import 是 编译时
        - require 任何地方，import 必须开头
        - import 会通过 babel 转码为 require
        - require 是赋值过程（可改），import 是解构过程
        - require/exports 是拷贝/赋值，import/export 是引用
    
    注：阮一峰《ES6 模块与 CommonJS 模块的差异》***
        https://wangdoc.com/es6/module-loader.html#es6-模块与-commonjs-模块的差异



### webpack 解析 - 大圣
    - CJs：node => module.exports/require
    - AMD：依赖前置，提前 require
    - CMD：cjs 规范，就近依赖
    - ESM：es6 => export/import

    - webpack 特点
        1. 是一个自执行函数，传入一个对象
        2. 对象的 key 是文件路径，value 是函数
    - webpack 执行流程
        1. 读取 webpack.config.js
        2. 解析文件依赖（对象）
        3. 替换 require 为 __webpack_require__
        4. 本地使用 {} 存储所有文件，通过 __webpack_require__ 获取文件内容，执行函数
    - webpack 做了什么
        1. 文件依赖解析
        2. 文件内容替换
            - loader 文件转换
            - require('xx.css')
            - require('xx.less')
            - require('xx.png')
        3. tapable - webpack 核心模块，增强版发布订阅库，plugin 基本实现方式
        4. compile 编译对象，有很多钩子，通过钩子做很多事，就是 plugin



### git hooks 是如何实现的 - 山月
    - 项目中 .git 目录中有个 hooks，hooks 下边有很多 hook 会在特定时机去触发，
    比如 precommit hook 就会在提交之前触发，所以只需要在 .git hooks 目录下，
    写一堆 bash 脚本去做一些事情就可以，比如 npm run lint/test，放到 precommit 里就可以

    - husky 是自定义了一个 git hooks 目录，然后可以在这个目录里写东西，这是 v5/v6 版本，
    在 v4 之前它其实写了一个 js 字符串，把这个字符串复制/移动到 precommit 内，
    然后在 precommit 阶段去做一些事情，最核心的工作就是创建一个 hooks 目录 corePath，
    然后在这个目录里写一个 precommit 脚本