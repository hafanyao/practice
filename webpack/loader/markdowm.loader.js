const marked = require('marked')
// loader 都是对外暴露一个函数
// module.exports 是 commonJs 规范
module.exports = (source) => {
    // source 就是调用 loader 传进来的内容
    const html = marked(source)
    const code = `module.exports=${JSON.stringify(html)}`
    return code
}