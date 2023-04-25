
async function sleep(delay, name = 'test'){
    return new Promise(resolve => {
        console.log(delay, name, 'start +++')
        setTimeout(() => {
            console.log(delay, name, 'end ---')
            resolve({delay, name})
        }, delay * 1000)
    })
}

async function asyncQueue({limit, items}) {
    const promisAll = []
    const queue = new Set()
    let count = 0
    for (const item of items) {
        count ++
        // 将'普通函数'转化为'异步函数'
        const fn = async item => await item()
        // 当前 promise 函数，相当于 while 中的 pop()
        const promisFn = fn(item)
        queue.add(promisFn)
        promisAll.push(promisFn)
        const clean = () => queue.delete(promisFn)
        // 相当于 promisFn.finally(clean)
        promisFn.then(clean, clean)
        console.log('-----', count);
        if (queue.size >= limit) {
            await Promise.race(queue)
        }
    }

    return Promise.all(promisAll)
}

async function start() {
    await asyncQueue({
        limit: 2,
        items: [
            () => sleep(1, '吃饭'),
            () => sleep(6, '睡觉'),
            () => sleep(3, '打球'),
            () => sleep(2, '看书'),
            () => sleep(1, '打码'),
        ]
    })
    console.log('=== end ===')
}

start()