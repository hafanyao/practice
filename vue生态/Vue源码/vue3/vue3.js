/*
    源码 -> 麓一
    云隐也讲过：https://applnzi6vl27059.pc.xiaoe-tech.com/live_pc/l_62c7a07de4b00a4f372389eb
*/

function isObject(data) {
    return data && typeof data === 'object'
}

/*
    targetMap: {
        target: { // Map()
            key: // Set()
                 [ReactiveEffect, ReactiveEffect, ...]
        }
    }
*/
// vue2 的时候有一个‘全局变量’ - Dep.target -- watcher
// 所以 3 中也需要一个全局变量来存放数据，effect（副作用）
let activeEffect

let targetMap = new WeakMap()

// 进行依赖收集
function track(target, key) {
    let depsMap = targetMap.get(target)
    if(!depsMap) targetMap.set(target, (depsMap = new Map()))
    // 再判断 depsMap 中有没有 key
    let dep = depsMap.get(key)
    if(!dep) depsMap.set(key, (dep = new Set()))
    trackEffect(dep)
}

function trackEffect(dep) {
    // 相当于 2 中的 Dep.target
    if(!dep.has(activeEffect)) dep.add(activeEffect)
}

// 触发
function trigger(target, key) {
    const depsMap = targetMap.get(target)
    if(!depsMap) return
    // effect 上面肯定会有一个 run
    depsMap.get(key).forEach(effect => effect && effect.run())
}
// const reactiveData = reactive({msg: 'hello hafan', age: 28})
export function reactive(data) {
    if(!isObject(data)) return
    return new Proxy(data, {
        get(target, key, receiver) {
            track(target, key)
            const ret = Reflect.get(target, key, receiver)
            return isObject(ret) ? reactive(ret) : ret
        },
        set(target, key, value, receiver) {
            trigger(target, key)
            Reflect.set(target, key, value, receiver)
            return true
        },
        deleteProperty(target, key) {
            const ret = Reflect.deleteProperty(target, key)
            trigger(target, key)
            return ret
        },
        has(target, key) {
            track(target, key)
            const ret = Reflect.has(target, key)
        },
        ownKeys(target) {
            track(target)
            return Reflect.ownKeys(target)
        }
    })
    
}

// const age = ref(28)
export function ref(init) {
    class RefImpl {
        constructor(init) {
            this.__value = init
        }
        get value() {
            track(this, 'value')
            return this.__value
        }
        set value(newVal) {
            this.__value = newVal
            trigger(this, 'value')
        }
    }
    return new RefImpl(init)
}

/*
    定义一个 effect 的函数中，第一个参数是一个函数
    如果这个函数中有使用 ref/reactive 则 effect 就会执行（也就是所谓的‘副作用’）

    调用 demo:
        effect(() => {
            console.log(num.value);
        })
    当 num.value 发生改变的时候，effect 函数还会再执行一次
    用到谁就触发谁的 get，就收集在谁那里
*/ 
function effect(fn, options = {}) {
    let __effect = new ReactiveEffect(fn)
    if(!options.lazy) {
        // 执行 ReactiveEffect.run，__effect 就被收集起来
        __effect.run()
    }
    return __effect
}

// const m = computed(() => num.value)
export function computed(fn) {
    // 只考虑函数的情况
    let __computed
    const e = effect(fn, {lazy: true})
    __computed = {
        get value() {
            return e.run()
        }
    }
    return __computed
}

// instance 相当于整个虚拟 dom（app）
// el: 挂载的 id 节点
export function mount(instance, el) {
    effect(function() {
        instance.$data && update(instance, el)
    })
    instance.$data = instance.setup()
    update(instance, el)
    function update(instance, el) {
        el.innerHTML = instance.render()
    }
}

class ReactiveEffect {
    constructor(fn) {
        this.fn = fn
    }
    run() {
        activeEffect = this
        return this.fn()
    }
}
