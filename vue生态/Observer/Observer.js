
class Observer {
    constructor(data) {
        this.walk(data)
    }
    _walk(data) {
        if(!data || typeof data !== 'object') return
        if(Array.isArray(data)) {
            const oldArrayPrototype = Array.prototype
            const arrProto = Object.create(oldArrayPrototype)
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
            const _that = this, keys = Object.keys(data)
            keys.forEach(key => {
                _that.defineReactive(data, key, data[key])
            })
        }
    }
    walk(data) {
        if(data === null || typeof data !== 'object') return
        if(Array.isArray(data)) {
            const oldArrayPrototype = Array.prototype
            const arrProto = Object.create(oldArrayPrototype)
            const methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'splice', 'reverse']
            methods.forEach(method => {
                arrProto[method] = function() {
                    oldArrayPrototype[method].call(this, ...arguments)
                }
            })
            data.__proto__ = arrProto
        }else {
            const _self = this, keys = Object.keys(data)
            keys.forEach(key => {
                _self.defineReactive(data, key, data[key])
            })
        }
    }
    _defineReactive(data, key, value) {
        this.walk(value)
        const _that = this
        // const dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                // Dep.target && dep.add(Dep.target)
                return value
            },
            set(newVal) {
                if(value === newVal) return
                value = newVal
                _that.walk(newVal)
                // dep.notify()
            }
        })
    }
    defineReactive(data, key, value) {
        this.walk(value)
        const _self = this
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                return value
            },
            set(newVal) {
                if(newVal === value || (Number.isNaN(value) && Number.isNaN(newVal))) return
                value = newVal
                _self.walk(newVal)
            }
        })
    }
}
