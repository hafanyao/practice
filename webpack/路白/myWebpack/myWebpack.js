// 1. 找到一个入口文件
// 2. 解析这个文件，提取它的依赖
// 3. 解析入口文件依赖的依赖（也就是递归去创建一个文件间的依赖图，描述所有文件的依赖关系）
// 4. 把所有文件打包成一个文件

// 根据步骤已知，入口文件为 entry.js
// node 中 fs 模块可以读取文件
// 通过 fs 模块引用入口文件
const fs = require('fs');

const babylon = require('babylon')
const traverse = require('babel-traverse').default

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