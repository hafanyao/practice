// 鹿线老李 
// https://www.bilibili.com/video/BV1N54y177by
// https://www.bilibili.com/video/BV1934y1H7r8?p=19
class Vue {
    constructor( options ) {

        this.$options = options

        this.$watchEvent = {}

        options.beforeCreate.bind(this)()

        this.$data = options.data
        this.proxyData()
        this.observe()
        options.created.bind(this)()

        options.beforeMount.bind(this)()
        this.$el = document.querySelector(options.el)

        options.mounted.bind(this)()

        // 模板解析
        this.compile(this.$el)
    }

    /*
        1. 为 Vue 对象赋值属性，数据源为 data
        2. data 中的属性和 Vue 对象属性保持双向一致（劫持）
    */
    proxyData(data) {
        for (const key in this.$data) {
            if (Object.hasOwnProperty.call(this.$data, key)) {
                // 为 this(Vue 对象) 添加 data 中的属性
                Object.defineProperty(this, key, {
                    enumerable: true, // 可枚举
                    configurable: true, // 可配置
                    get() {
                        return this.$data[key]
                    },
                    set(newVal) {
                        if(this.$data[key] != newVal) {
                            this.$data[key] = newVal
                            // this.compile(this.$el)
                        }
                    }
                })
            }
        }
    }

    // 监听 data 变化并执行 watch 中的 updata
    observe() {
        for (const key in this.$data) {
            if (Object.hasOwnProperty.call(this.$data, key)) {
                const _that = this
                let value = this.$data[key]
                Object.defineProperty(this.$data, key, {
                    enumerable: true, // 可枚举
                    configurable: true, // 可配置
                    get() {
                        return value
                    },
                    set(newVal) {
                        console.log(newVal);
                        if(value != newVal) {
                            value = newVal
                            if(_that.$watchEvent[key]) {
                                _that.$watchEvent[key].forEach(item => item.update())
                            }
                        }
                    }
                })
            }
        }
    }

    // 模板解析
    compile(node) {
        // 所有子节点 - node.childNodes
        node.childNodes.forEach((item, index) => {
            // 元素节点
            if(item.nodeType === 1) {

                // 判断元素 v-model 属性
                if(item.hasAttribute('v-model')) {
                    const vmKey = item.getAttribute('v-model').trim()
                    if(this.hasOwnProperty(vmKey)) {
                        item.value = this[vmKey]
                    }
                    item.addEventListener('input', event => {
                        this[vmKey] = item.value
                    })
                }

                // 判断元素节点是否绑定了 点击事件
                if(item.hasAttribute('@click')) {
                    const eventName = item.getAttribute('@click').trim()
                    // 为元素添加监听事件
                    item.addEventListener('click', event => {
                        // 获取 methods 内的对应事件
                        this.eventFn = this.$options.methods[eventName].bind(this)
                        this.eventFn(event)
                    })
                }

                // 如果有子元素则递归解析
                item.childNodes.length && this.compile(item)
                return
            }
            // nodeType - 文本类型
            if(item.nodeType === 3) {
                // 如果有 {{}} 就替换成数据 - item.textContent = '123'
                // 正则匹配 给节点赋值
                const reg = /\{\{(.*?)\}\}/g
                const text = item.textContent
                // match => {{str}} -- vmKey => str
                item.textContent = text.replace(reg, (match, vmKey) => {
                    vmKey = vmKey.trim()
                    // vmKey: msg
                    if(this.hasOwnProperty(vmKey)) {
                        const watcher = new Watcher(this, vmKey, item, 'textContent')
                        if(!this.$watchEvent[vmKey]) {
                            this.$watchEvent[vmKey] = [watcher]
                        }else {
                            this.$watchEvent[vmKey].push(watcher)
                        }
                    }
                    // 返回 data 中的 str 字段
                    return this.$data[vmKey]
                })
            }
        })
    }
}

class Watcher {
    constructor(vm, key, node, attr) {
        // 对象
        this.vm = vm
        // 属性
        this.key = key
        // 节点
        this.node = node
        // 改变节点内容的方法
        this.attr = attr
    }
    // 更新操作
    update() {
        this.node[this.attr] = this.vm[this.key]
    }
}

