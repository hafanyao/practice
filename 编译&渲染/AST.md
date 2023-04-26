### 抽象语法树 AST

- AST 应用场景：
    - 编辑器错误提示、代码格式化/高亮、自动补全；
    - elint、pretiier 对代码错误或风格的检查；
    - webpack 通过 babel 转译 javascript 语法；

- AST 如何生成：
    - js 执行的第一步是读取 js 文件中的字符流，然后通过词法分析生成 token；
    - 再通过语法分析( Parser )生成 AST，最后生成机器码执行
    - 讲解：https://juejin.cn/post/6844904035271573511

- AST 解析过程：
    1. 分词 => “今天”，“天气”，“真好” => 把 js 分解成最小词法单元
    2. 语义分析 => 比较难，不像分词这样有个标准，需要自己摸索

    - 注：JS Parser 是 js 语法解析器，可以将 js 转成 AST，
        常见的 Parser 有 esprima、traceur、acorn、shift 等



## vue 的编译过程是：
    1. 先从字符串生成AST --- parse
    2. 对AST优化处理（标记静态节点等）--- optimize
    3. 将AST对象转为字符串形式的JS代码 --- generate



## babel的过程：解析 —— 转换 —— 生成