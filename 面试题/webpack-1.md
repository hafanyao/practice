01. 什么是 webpack
    - 是一个现代 javascript 应用程序的 **静态模块打包器 (module bundler)**
    - webpack是基于入口的。
    - webpack会自动地递归解析所有文件需要的所有资源文件，
        然后用不同的Loader来处理不同的文件，用Plugin来扩展webpack功能。

- 什么是 Turbopack 
    - 面向 JS 和 TS 优化的增量打包工具和构建系统，采用 Rust 编写，声称是 Webpack 的继任者
    - 号称热更新速度比 Webpack 快 700 倍、比 Vite 快 10 倍，冷启动速度比 Webpack 快 5 倍
    - Turbopack 在打包时仅引入所需的最少资源，Turbo 可实现细分到函数粒度的结果缓存、支持内存缓存未
    - 未来还将有持久化缓存和远程缓存，以及支持按需编译，尽量减少计算量
    - 尤雨溪便亲自创建了测试基准来比较 Vite 和 Turbopack 在 HMR（模块热加载）方面的性能差异
    - 应用程序的模块数量增加到 30k 以上时，Turbopack  的 HMR 速度比 Vite 快 10 倍，
        当模块数量超过 50k 时，Turbopack 比 Vite 快 20 倍
    - 尤雨溪认为，开源软件的竞争应该建立在开放的沟通、公平的比较和相互尊重的基础上。所以当他看到 Vercel 使用了精心挑选、未经同行评审、存在误导的数据来进行营销时，感到失望和担忧，因为这种场景通常只在商业竞争中发生



02. webapck 为什么需要打包工具 - 西岭 - https://www.bilibili.com/video/BV1n44y1r7Dv?p=10
    - 打包工具的出现，是模块化造成的问题 ***
    - ES Module 的浏览器兼容问题
    - 模块文件过多导致频繁发送网络请求
    - 资源文件模块化问题
    
    注：整个打包过程 loader 起到了非常重要的作用，如果没有 loader
    webpack 就没有办法实现各种资源的文件加载，也就只有合并 js 的能力了

    loader 的工作原理：获取到原内容，处理成需要的然后再返回



03. webpack 能做什么 - 本质就是打包
    1. 语法转换
        + ES6 转换成 ES5
        + less/sass/stylus 转换成 css
        + ...
    2. html/css/js 代码压缩合并 (打包)
    3. webpack 可以在开发期间提供一个开发环境
        + 自动打开浏览器
        + 保存时自动刷新



04. webpack 热更新原理
    1. 启动webpack生成compiler实例，compiler上有很多方法，例如监听本地文件的变化
    2. 使用express框架启动本地server，让浏览器可以请求本地的静态资源
    3. 启动websocket服务，当本地文件发生变化，可以立即告知浏览器可以热更新代码

    1. 当修改了一个或多个文件
    2. 文件系统接收更改并通知 webpack
    3. webpack 重新编译构建一个或多个模块，并通知 HMR（Hot Module Replacement）服务器进行更新
    4. HMR Server 使用 Websocket 通知 HMR runtime 需要更新，HMR runtime 通过 HTTP 请求更新 jsonp
    5. HMR runtime 替换更新中的模块，如果确定这些模块无法更新，则触发整个页面刷新；



04. 谈谈你对 webpack 的看法
    - WebPack 是一个模块打包工具，可以使用WebPack管理模块依赖，并编绎输出模块们所需的静
    态文件。它能够很好地管理、打包Web开发中所用到的HTML、JavaScript、CSS以及各种静态文件（图
    片、字体等），让开发过程更加高效。对于不同类型的资源，webpack有对应的模块加载器。webpack
    模块打包器会分析模块间的依赖关系，最后生成优化且合并后的静态资源。
    - webpack的两大特色：
        - 1）code splitting（可以自动完成）
        - 2）loader 可以处理各种类型的静态文件，并且支持串联操作
    - webpack 是以commonJS的形式来书写脚本的，但对 AMD/CMD 的支持也很全面，方便旧项目进行代
    码迁移。
    - webpack具有requireJs和browserify的功能，但仍有很多自己的新特性：
        - 1）对 CommonJS、AMD、ES6的语法做了兼容
        - 2）对js、css、图片等资源文件都支持打包
        - 3）串联式模块加载器以及插件机制，让其具有更好的灵活性和扩展性，例如提供对CoffeeScript、ES6的支持
        - 4）有独立的配置文件webpack.config.js
        - 5）可以将代码切割成不同的chunk，实现按需加载，降低了初始化时间
        - 6）支持 SourceUrls 和 SourceMaps，易于调试
        - 7）具有强大的Plugin接口，大多是内部插件，使用起来比较灵活
        - 8）webpack 使用异步 IO 并具有多级缓存。这使得 webpack 很快且在增量编译上更加快



05. vite 与 webpack 的区别 - npm init @vitejs/app

    - webpack dev 环境下需要将所有模块进行打包，不管文件是否修改都会整个项目 build，
      执行过程先执行入口文件，然后通过 loader 和插件对模块进行编译处理，最后输出结果

    - vite 基于 esm，直接向浏览器输出 es module 不需要编译/打包，是按需加载的，
      即模块需要时加载而不像 webpack 需要预先对模块进行编译处理，且配置比 webpack 更简单，
      基于 es buile 实现预构建，es build 用 go 语言开发，比 js 快 10-100 倍
    


06. webpack 的构建流程
    1. 初始化参数: 读取 shell 脚本 和 webpack.config.js 配置，合并参数
    2. 开始编译: 初始化一个 Compiler 对象，加载所有配置，执行 run 方法开始编译
    3. 确定入口: 根据 entry 中的配置找出所有入口文件
    4. 编译文件: 从入口文件开始，调用所有的 loader 对‘模块’进行编译转成 AST，
                再去递归找所有模块的依赖
    5. 完成模块编译: 编译完成后，得到每个模块被翻译后的内容以及他们之间的依赖关系
    6. 输出资源: 根据模块间依赖关系，打包成一个个包含多个 module 的 chunk，
                再把每个 Chunk 转换成单独的文件加入到输出列表，这步是可以修改输出内容的最后机会
    7. 输出完成: 确定好输出内容后，根据 output 确定文件名以及文件路径，把文件内容写入到文件系统

    - 初始化参数 - 开始编译 - 确定入口 - 编译模块 - 完成编译 - 输出资源 - 输出完成

    # 答案 2
        - webpack启动后，从 entry 开始，递归解析 entry 依赖的所有 module，
        找到每 module.rules 里配置的 loader 进行相应的转换处理，对 module 转换后，
        解析模块，解析的结果是一个一个的 chunk，最后 webpack 会将所有 chunk 转换成
        在整个构建过程中，webpack 会执行 plugin 当中的插件，完成 plugin 的任务
        
        - entry: 模块入口，使得源文件加入到构建流程中
        - output: 配置如何输出最终代码
        - module: 配置各种类型的模块的处理规则
        - plugin: 配置扩展插件的
        - devServer: 实现本地服务：包括 http 模块热替换，sourceMap 等服务



07. webpack performance
    - 配置如何展示性能提示。例如，如果一个资源超过 250kb，webpack 会对此输出一个警告来通知你。



08. webpack 性能优化，主要优化两个方面：
    - 1.优化开发体验 
        - 提升效率
        - 优化构建速度
        - 优化使⽤体验
    - 2.优化输出质量
        - 优化要发布到线上的代码，减少⽤户能感知到的加载时间
        - 提升代码性能，性能好，执⾏就快

    - 构建速度
        - 多线程打包，把打包进程拆分成多个线程
        - 缩⼩⽂件范围 Loader，配置 include
        - tree Shaking，就是清除无用css,js
            sideEffects: false - 正常对所有模块进⾏ tree shaking, ⽣产模式有效
        - cache-loader 缓存资源，提高二次构建的速度
            在一些性能开销较大的 loader 之前添加 cache-loader，将结果缓存中磁盘中
        - exclude & include 不/需要处理的文件


    - webpack 打包体积优化，cachegroup
        - 按需引入，比如 element/antd
        - 按需加载，项目中的路由懒加载
        - 压缩 js/css/html，Gzip 压缩
        - 代码分割 code Splitting，
            打包完后，所有⻚⾯只⽣成了⼀个bundle.js
            代码体积变⼤，不利于下载，没有合理利⽤浏览器资源
        - splitChunks 配置缓存组/抽离公共代码
        - 借助 MiniCssExtractPlugin 抽离css
        - externals 配置，将 JS 文件、CSS 文件存在 CDN
            处理第三方库的姿势有很多，其中，Externals 会引发重复打包的问题；
            而 CommonsChunkPlugin 每次构建时都会重新构建一次 vendor；
            出于对效率的考虑，我 DllPlugin 是最佳选择。
        - 使用 url-loader 或 image-webpack-loader 对图片进行转化或者压缩处理

        - https://juejin.cn/post/6844904093463347208 ***
        - 配置 include/exclude - exclude 优先级更高，推荐 include
        - cache-loader 开销大的 loader 前添加 cache-loader，将结果缓存中磁盘中
            默认保存在 node_modueles/.cache/cache-loader 目录下
        - 多进程打包，把任务分解多个子进程并发执行，子进程处理完把结果发送给主进程
        - DllPlugin 和 DLLReferencePlugin 可以实现拆分 bundles，可以大大提升构建速度
        - 抽离公共代码，配置在 optimization.splitChunks 中，公共代码只需要下载一次
        - runtimeChunk 的作用是将包含 chunk 映射关系的列表从 main.js 中抽离出来
        - 借助 webpack-bundle-analyzer 查看一下是哪些包的体积较大，分析打包结果
    ```js
        // 安装 compression-webpack-pLugin
        // vue.config.js
        const CompressionPlugin = require('compression-webpack-plugin')
        // gzip 压缩处理
        chainWebpack: (config) => {
            if(isProd) {
                config.plugin('compression-webpack-plugin')
                    .use(new CompressionPlugin({
                        test: /\.js$|\.html$|\.css$/, // 匹配文件名
                        threshold: 10240, // 对超过10k的数据压缩
                        deleteOriginalAssets: false // 不删除源文件
                    }))
            }
        }
        // js 压缩插件 terser-webpack-plugin
        // https://www.jianshu.com/p/4ce8e2247033
    ```
    