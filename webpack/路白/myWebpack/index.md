# 实现一个自己的打包工具

webpack

本质上，webpack 是一个现代 js 应用程序的静态模块打包器

当 webpack 处理应用程序的时候，它会递归构建一个依赖关系图，
其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle



## 概览

1. 找到一个入口文件
2. 解析这个文件，提取它的依赖
3. 解析入口文件依赖的依赖（也就是递归去创建一个文件间的依赖图，描述所有文件的依赖关系）
4. 把所有文件打包成一个文件


## 开始开发

1. 新建几个 js 源文件

* name.js / message.js / entry.js

2. 观察三个文件的依赖关系

entry 依赖 message，message 依赖 name

entry.js -> message.js -> name.js

3. 开始编写自己的打包工具 -> myWebpack.js

4. 分析 ast，思考如何能够解析出 entry.js 的依赖

4.1 File -> program
4.2 program -> body 里面是各种语法的描述
4.3 ImportDeclaration 引入的声明
4.4 ImportDeclaration source 属性，source.value 就是引入文件的地址 './message.js'

5. 生成 entry.js 的 ast

babylon: 一个基于 babel 的 js 解析工具

```js
const fs = require('fs');
const babylon = require('babylon')

function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8')
    const ast = babylon.parse(content, {
        sourceType: 'module'
    })
    console.log(ast);
}

createAsset('./source/entry.js')
```

6. 基于 AST，找到 entry.js 的 ImportDeclaration Node

```js
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8')
    const ast = babylon.parse(content, {
        sourceType: 'module'
    })

    traverse(ast, {
        ImportDeclaration: ({
            node
        }) => {
            console.log(node);
        }
    })
}

createAsset('./source/entry.js')
```

7. 获取 entry.js 的依赖

```js
function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8')
    const ast = babylon.parse(content, {
        sourceType: 'module'
    })

    const dependencies = [] // 依赖关系

    traverse(ast, {
        ImportDeclaration: ({
            node
        }) => {
            dependencies.push(node.source.value)
        }
    })

    console.log(dependencies);
}

createAsset('./source/entry.js')
```

8. 优化 createAsset，使其能够区分文件

因为要获取所有文件的依赖，所以需要一个 id 来标识所有文件（最简单的用一个自增的 number）

先获取 entry.js 的 id / filename 以及 dependencies

```js
let ID = 0;

function createAsset(filename) {
    const content = fs.readFileSync(filename, 'utf-8')
    const ast = babylon.parse(content, {
        sourceType: 'module'
    })

    const dependencies = []

    traverse(ast, {
        ImportDeclaration: ({
            node
        }) => {
            dependencies.push(node.source.value)
        }
    })

    return {
        id: ID++,
        filename,
        dependencies
    }
}

const mainAsset = createAsset('./source/entry.js')

console.log(mainAsset);
```














