### 抽象语法树AST
- vue的编译过程是：
    1. 先从字符串生成AST --- parse
    2. 对AST优化处理（标记静态节点等）--- optimize
    3. 将AST对象转为字符串形式的JS代码 --- generate