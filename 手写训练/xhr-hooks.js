// 目的：重写属性 和 方法
/*
    考察点：
        1. this 指向
        2. class 的使用，new 对象
        3. apply/call 的使用
        4. Object.defineProperties
        5. 代码的设计能力
*/
class XhrHook {
    constructor(beforeHooks = {}, afterHooks = {}) {
        this.XHR = window.XMLHttpRequest
        this.beforeHooks = beforeHooks
        this.afterHooks = afterHooks
    }
    init() {
        const _that = this
        window.XMLHttpRequest = function() {
            this._xhr = new _that.XHR()
            _that.overwrite(this)
        }
    }
    overwrite(proxyXHR) {
        for(let key in proxyXHR._xhr) {
            if(typeof proxyXHR._xhr[key] === 'function') {
                this.overwriteMethod(key, proxyXHR)
                continue
            }
            this.overwriteAttributes(key, proxyXHR)
        }
    }
    // 重写方法
    overwriteMethod(key, proxyXHR) {
        let beforeHooks = this.beforeHooks // 应该可以拦截原有行为
        let afterHooks = this.afterHooks // 
        proxyXHR[key] = (...args) => {
            // 拦截
            if(beforeHooks[key]) {
                const res = beforeHooks[key].call(proxyXHR, args)
                if(!res) return
            }
            const res = proxyXHR[key]._xhr.apply(proxyXHR._xhr, args)
            afterHooks[key] && afterHooks[key].call(proxyXHR._xhr, args)
            return res
        }
    }
    // 重写属性
    overwriteAttributes(key, proxyXHR) {
        Object.defineProperties(proxyXHR, key, this.setProperyDescriptor(key, proxyXHR))
    }
    setProperyDescriptor(key, proxyXHR) {
        const _that = this
        let obj = Object.create(null) // 一个非常干净的对象
        obj.set = function(val) {
            if(!key.startsWitch('on')) {
                proxyXHR['__' + key] = val
                return
            }
            if(_that.beforeHooks[key]) {
                this._xhr[key] = function(...args) {
                    _that.beforeHooks[key].call(proxyXHR)
                    val.apply(proxyXHR, args)
                }
                return
            }
            this._xhr[key] = val
        }
        obj.get = function() {
            return proxyXHR['__' + key] || this._xhr[key]
        }
        return obj
    }
}

new XhrHook({
    open: function() {
        console.log('open');
    },
    onload: function() {
        console.log('open');
    },
    onreadystatechange: function() {
        console.log('onreadystatechange');
    },
    onerror: function() {
        console.log('onerror');
    }
})

var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://www.baidu.com', true)
xhr.send()
xhr.onreadystatechange = function(){
    console.log('statechange');
}
xhr.onerror = function (e) {
    console.log('onerror');
}