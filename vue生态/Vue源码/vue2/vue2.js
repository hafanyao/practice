// 简版 vue 源码

export function Vue(options = {}) {
    this.__init(options)

}
// initMixin
Vue.prototype.__init = function(options) {
    // this.$options = options
    /*
        假设这里已经是一个 el，源码里会判断，
        如果是字符串则 document.getelementById
    */ 
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods
    // beforeCreate == initState -- initData
    proxy(this, this.$data)
    new Observer(this.$data)
    new Compiler(this)
}

// this.$data.msg --> this.msg
//             this    this.$data
function proxy(target, data) {
    Object.keys(data).forEach(key => {
        Object.defineProperty(target, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可配置
            get() {
                return data[key]
            },
            set(newVal) {
                // 要考虑 NaN 的情况
                if(!isSameVal(data[key], newVal)) {
                    data[key] = newVal
                }
            }
        })
    })
}

class _Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if(!data || typeof data !== 'object') return

        if(Array.isArray(data)) {
            // https://blog.csdn.net/xiaoshunshi/article/details/123104748
            // 拿到数组的原型对象
            const oldArrayPrototype = Array.prototype
            /*
                Object.create - 遗传方法，
                创建新对象原型指向，再扩展新的方法不会影响原型，
                不污染array原来的原型对象，也就是组合寄生式继承 ***
            */
            const arrProto = Object.create(oldArrayPrototype)
            // arrProto -> Array {} -> 什么方法都没有
            // arrProto.push = function() {} // 也就是 重新定义数组的方法 ***
            // array数组，这7种方法是终会改变数组本身
            const methodsToPatch = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse']
            methodsToPatch.forEach(method => {
                arrProto[method] = function() {
                    // 通过 call 实现数组方法原有的功能
                    oldArrayPrototype[method].call(this, ...arguments)
                }
            })
            // 覆盖数组原有的原型对象
            data.__proto__ = arrProto
        }else {
            Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
        }

        return

        if (Object.prototype.toString.call(data) === '[object Object]') {
            Object.keys(data).forEach(key => this.defineReactive(data, key, data[key]))
        } else if (Object.prototype.toString.call(data) === '[object Array]') {
            
        }
    }
    // 把 data 里的每一个数据收集起来（递归）
    defineReactive(obj, key, value) {
        const _that = this
        this.walk(value)
        let dep = new Dep()
        // 代理一层
        Object.defineProperty(obj, key, {
            enumerable: true, // 可枚举
            configurable: true, // 可配置
            get() {
                // Watcher 内赋值了 ‘this’
                // 四、对于 age 来说，执行这一句
                // 五、age 中的 dep 就有了这个 watcher
                Dep.target && dep.add(Dep.target)
                return value
            },
            set(newVal) {
                if(!isSameVal(value, newVal)) {
                    console.log(newVal);
                    value = newVal
                    // 新值没有响应式，所以需要重新 walk
                    _that.walk(newVal)
                    // 六、执行回调 重新 set 值，更新视图
                    dep.notify()
                }
            }
        })
    }
}

class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        if(!data || typeof data !== 'object') return
        if(Array.isArray(data)) {
            const oldArrayPrototype = Array.prototype
            const arrProto = Object.create(oldArrayPrototype)
            const methods = ['push', 'pop', 'shift', 'unshfit', 'sort', 'reverse', 'splice']
            methods.forEach(method => {
                arrProto[method] = function() {
                    oldArrayPrototype[method].call(this, ...arguments)
                }
            })
            data.__proto__ = arrProto
        }else {
            const _self = this
            Object.keys(data).forEach(key => {
                _self.defineProperty(data, key, data[key])
            })
        }
    }
    defineProperty(data, key, value) {
        this.walk(value)
        const _self = this
        let dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get: () => {
                Dep.target && dep.add(Dep.target)
                return value
            },
            set: newVal => {
                if(newVal !== value) {
                    value = newVal
                    _self.walk(newVal)
                    dep.notify()
                }
            }
        })
    }
}

// 数据改变视图才会更新，需要去观察
// 一、new Watcher(vm, 'age', () => { 更新视图 age })
class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm // vue 实例
        this.key = key
        this.cb = cb

        // 二、此时 Dep.target 作为一个全局变量理解，存的就是这个 watcher
        Dep.target = this
        // 三、一旦进行赋值就会触发这个值的 getter 方法
        this.__old = vm[key]
        // 再把 Dep.target 清空
        Dep.target = null
    }
    // 八、执行所有 cb 函数
    update() {
        const newVal = this.vm[this.key]
        if(!isSameVal(newVal, this.__old)) {
            this.cb(newVal)
        }
    }
}

// 每个数据都要有一个 Dep 的依赖
class Dep {
    constructor() {
        this.watchers = new Set()
    }
    // 收集依赖
    add(watcher) {
        if(watcher && watcher.update) {
            this.watchers.add(watcher)
        }
    }
    // 七、通知依赖项，让所有 watcher 执行 update 模式
    notify() {
        // watcher 和 Dep 的组合就是发布订阅模式
        this.watchers.forEach(watc => watc.update())
    }
}

class Compiler {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.methods = vm.$methods

        this.compile(vm.$el)
    }
    // 递归编译 #app 下面所有的节点内容
    compile(el) {
        const childNodes = el.childNodes
        // 类数组
        Array.from(childNodes).forEach(node => {
            // 判断节点类型执行对应函数
            if(node.nodeType === 3) {
                this.compileText(node)
            }else if(node.nodeType === 1) {
                this.compileElement(node)
            }
            // 如果还有子节点，则递归执行
            if(node.childNodes && node.childNodes.length) this.compile(node)
        })
    }
    compileText(node) {
        // 匹配出 {{ age }}
        const reg = /\{\{(.+?)\}\}/,
            value = node.textContent
        if(reg.test(value)) {
            const key = RegExp.$1.trim()
            // 开始时赋值
            console.log(this.vm[key]);
            node.textContent = value.replace(reg, this.vm[key])
            // 添加观察者
            new Watcher(this.vm, key, val => {
                // 数据改变时的更新
                node.textContent = val
            })
        }
    }
    compileElement(node) {
        // 简化版，只做 v-on 和 v-modal 的匹配
        if(node.attributes.length) {
            Array.from(node.attributes).forEach(attr => {
                let attrName = attr.name
                if(attrName.startsWith('v-')) {
                    // v- 指令匹配成功
                    attrName = attrName.indexOf(':') > -1 ? attrName.substr(5) : attrName.substr(2)
                    const key = attr.value
                    this.update(node, key, attrName, this.vm[key])
                }
            })
        }
    }
    update(node, key, attrName, value) {
        if(attrName === 'model') {
            node.value = value
            new Watcher(this.vm, key, val => node.value = val)
            node.addEventListener('input', () => {
                this.vm[key] = node.value
            })
        }else if(attrName === 'click') {
            node.addEventListener(attrName, this.methods[key].bind(this.vm))
        }
    }
}

function isSameVal(a, b) {
    return a === b || (Number.isNaN(a) && Number.isNaN(b))
}


/*
    Vue.js 是采用数据劫持结合发布者-订阅者模式的方式，
        通过 Object.defineProperty()来劫持各个属性的 setter，getter，
        在数据变动时发布消息给订阅者，触发相应的监听回调。

    主要分为以下几 个步骤： 
        
    1.需要 observe 对数据对象进行递归遍历，包括子属性对象的属性， 
        都加上 setter 和 getter 这样的话，给这个对象的某个值赋值，
        就会 触发 setter，那么就能监听到了数据变化 
        
    2.compile 解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，
        并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，
        一旦数据有变动，收到通知，更新视图 
    
    3.Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁，
        主要做的事情是: 
            ① 在自身实例化时往属性订阅器(dep)里面添加自己 
            ② 自身必须有一个 update() 方法 
            ③ 待属性变动 dep.notice() 通知时，能调用自身的 update()方法，并触发 Compile 中绑定的回调 
        
    4.MVVM 作为数据绑定的入口，整合 Observer、Compile 和 Watcher 三者，
        通过 Observer 来监听自己的 model 数据变化，通过 Compile 来解析编译模板指令，
        最终利用 Watcher 搭起 Observer 和 Compile 之间的通信桥梁，
        达到数据变化 -> 视图更新；视图交互变化(input) -> 数据 model 变更的双向绑定效果。


    - 双向绑定流程是什么的
        1. new Vue() 首先执行初始化，对 data 执行响应化处理，这个过程发生 Observe 中
        2. 同时对模板编译，找到动态绑定的数据，从 data 中获取并初始化视图，这个过程发生在 Compile
        3. 同时定义⼀个更新函数和 Watcher，将来对应数据变化时 Watcher 会调用更新函数
        4. data 的 key 可能在视图中出现多次，所以每个 key 都需要⼀个管家 Dep 来管理多个 Watcher
        5. 将来 data 中数据⼀旦发生变化，会首先找到对应的 Dep，通知所有 Watcher 执行更新函数

*/