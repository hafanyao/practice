
### js 面向对象相关总结 ==> 面试回答目标‘半小时’。。


- 定义
    1. 面向对象是一种思想，是基于面向过程而言的，面向对象是将功能等通过对象来实现，将功能封装进对象之中，让对象去实现具体的细节；
    2. 这种思想是将数据作为第一位，这是对数据一种优化，操作起来更加的方便，简化了过程
    3. Js 本身是没有 class 类型的，但是每个函数都有一个 prototype 属性，prototype 指向一个对象，当函数作为构造函数时，prototype 就起到类似于 class 的作用
    4. 面向对象有三个特点：
        - 封装（隐藏对象的属性和实现细节，对外提供公 共访问方式）
        - 继承（提高代码复用性，继承是多态的前提
        - 多态（是父类或接口定义的引用变量可以指向子类或具体实现类的实例对象）

## ES5
    ```js
        // 创建对象
        const obj = {}
        const obj = new Object()
        function Person() {} ==> new Person() ==> 对象（类的实例）
    ```
# 面向对象三大特征
    1. 封装：方法/属性封装到类的内部
    2. 继承：子类可以继承父类的属性和方法
    3. 多态：同一个方法在父类中定义了，在子类中仍可定义，但是内容不同

# 面向对象又是
    1. 易维护
    2. 质量高
    3. 易拓展

# this 关键字四种绑定方式
    1. 默认绑定：function (){ this }
    2. 隐式绑定：function a() { this } ==> obj = { fn: a }, 那么 this 指向 obj
    3. 显式绑定：fn.call(obj) ==> fn 中的 this 指向 obj
    4. new 绑定：p = new Person(), this 指向 p

# 继承
    1. 原型链继承：
    2. 构造函数继承：
    3. 组合继承：
    4. 组合寄生式继承：

# 设计模式，沿用 java 的设计模式共计 23 种
    1. 单例模式：一个类只能有一个实例，如果实例存在直接使用，如果没有就创建
    2. 工厂模式：使用某些方法批量创建对象
    3. 观察者模式：创建一个观察者，通过 Object.defineproperty 修改属性
    4. 订阅模式：发布者内容变化，通过中间层通知订阅者，更新相应变化



## ES6
    ```js
        class P extends Person {
            super()
            constructor() {

            }
            static() {

            }
        }
    ```
