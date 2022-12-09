# webpack - 路白


## webpack 中的 Module 是指什么
1. webpack 支持 ESModule, CommonJS, AMD, Assets(image, font, video, audio, json)
    - require 是 AMD/CommonJS 规范引入方式
    - export/import是 ES6 的一个语法标准
    - require 是运行时，import 是 编译时

1. ESM
    - 关键字 export 允许将 ESM(ESModule) 中内容暴露给其他模块
    - 关键字 import - 解构
    - package.json 
        type: module -> 强制让 package.json 下的所有文件全都使用 ESMdule
        type: commonjs -> 强制让 package.json 下的所有文件全都使用 CommonJS

2. CommonJS 
    - node 中使用，浏览器不能用，因为不支持 module.exports
    - module.exports: 允许将 CommonJS 中的内容暴露给其他模块
    - 通过 require 方式引入其他模块内容

3. 不同
    cjs 是运行时加载，esm 是编译时加载



### webpack moudles 如何表达各种依赖关系
* ESM import 语句
* CommonJS require - module.exports
* AMD define require
* css/sass/less @import



### chunk 和 bundle 的区别（important ！！！）

1. Chunk
    - Chunk 是 webpack 打包‘过程中’ Modules 的集合，是（打包过程中）的概念
    - Webpack 的打包是从一个入口模块开始的，入口模块引用其他模块，其他模块引用其他模块...
    - Webpack 通过引用关系逐个打包编译，这些 module 就形成了一个 chunk

2. bundle
    - 打包完成后输出的一个或多个打包好的文件

3. Chunk 和 bundle 的区别是什么
    - 大多数情况下一个 chunk 会生成一个 bundle，但也有例外
    - 如果 sourcemap，一个 entry，一个 chunk 对应两个 bundle
    - Chunk 是过程中代码块，bundle 是打包结果输出的代码块，chunk 在构建完成后就形成 bundle



### Plugin 和 Loader 分别是做什么工作的

1. Loader - 转换器
    - 模块转换器，将非 js 模块转换为 webpack 能识别的 js 模块
    - 本质上 webpack loader 将所有类型文件，转换为应用程序的**依赖图**可以直接引用的模块


2. Plugin - 扩展插件
    - webpack 生态的关键部分，运行在 webpack 打包的各个阶段
    - 提供了强大的方法来扩展 webpack 开发和 webpack 的编译过程

    - 作用（官方）
        - 通过插件可以扩展 webpack，加入自定义的构建行为，使 webpack 可以执行更广泛的任务，拥有更强的构建能力

    - 工作原理 - 深入浅出 Webpack
        1. webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果
        2. 每个流程职责都是单一的，多个流程之间存在依赖，完成上一个才能交下一个流程去处理
        3. 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理
        4. Tapable 是 webpack 的核心功能库，提供了插件接口（钩子）组织这条复杂的生产线
        5. webpack 运行会广播事件，插件就是监听它所关心的事件，加入到生产线中改变生产线
        6. webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性更好

    - plugin 中异步请求会阻塞后面的 plugin 吗
        - 参照‘工作原理 2’ —— 会
        - 先去理解，什么是 plugin 后面的 plugin
        - 每个 plugin 对应 webpack hooks 不同生命周期，plugins 数组顺序不能代表执行顺序
        - 异步请求要注册异步 hooks（tapAsync或者tapPromise），这时接收函数有一个 callback 回调，只有执行 callback 后，编译才会继续往下执行
        - https://juejin.cn/post/7070405974481174536


3. Compiler - 编译对象
    - 包含了 webpack 环境的所有配置信息，包括 options，loaders，plugins
    - 在 webpack 启动时候实例化，也是全局唯一的


4. Compliation - 并发
    - 包含了当前的模块资源，编译生成资源
    - webpack 在开发模式下运行的时候，每当检测到一个文件变化，就会创建一次新的 Compliation



### 描述 webpack 的打包过程（important ！！！）

1. 初始化参数: 读取 shell 和 webpack.config.js 配置，合并参数

2. 开始编译: 初始化一个 Compiler 对象，加载所有配置，执行 run 方法编译

3. 确定入口: 根据 entry 中的配置找出所有的入口文件

4. 编译文件: 从入口文件开始，调用所有的 loader 对 module 模块进行编译转成 AST，
            再去递归找所有模块的依赖

5. 完成模块编译: Loader 编译后，得到每个模块被翻译后的内容以及他们之间的依赖关系

6. 输出资源: 根据模块间依赖关系，打包成一个个包含多个 module 的 chunk，
            再把每个 Chunk 转换成单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

7. 输出完成: 确定好输出内容后，根据配置确定要输出的文件以及文件路径，把文件内容写入到文件系统

- 初始化参数 - 开始编译 - 确定入口 - 编译模块 - 完成编译 - 输出资源 - 输出完成


