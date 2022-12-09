# https://www.zhihu.com/question/20351507
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
    * ESM：export => import 语句
    * CommonJS：module.exports => require
    * AMD define require
    * css/sass/less @import



### require 和 import 的区别
- node编程中最重要的思想就是模块化，import 和 require 都是被模块化所使用
    - 遵循规范：
        - require 是 AMD 规范引入方式
        - export/import是 ES6 的一个语法标准，如果要兼容浏览器的话必须转化成 ES5 的语法
    - 调用时间：
        - export/import 是编译时调用，所以必须放在文件开头
        - require 是运行时调用，所以require理论上可以运用在代码的任何地方
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



### AMD/CMD/UMD
- 区别
    1. CMD 是 commonJs 规范
    2. AMD 是依赖前置 - 提前 require
    3. CMD 则就近依赖 - 需要时 require - 按需加载
    4. CommonJS/AMD 都是 require，ESM 则是 import
    5. UMD - 通过模块定义 - 判断/兼容 服务器和浏览器环境
        - 如果是 AMD，则使用 AMD 方式定义
        - 如果是 cjs，则使用 CMD 方式定义
        - 如果都不是，则挂在全局对象



### webpack 解析 - 大圣
    - AMD：依赖前置，提前 require
    - CMD：cjs 规范，就近依赖
    - cjs：node => module.exports/require
    - es6：es6 => export/import

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