/*
    面试：并发 10，需求最大 3
    输入：promise数组、limit上限
    存储：reqpool - 并发池
    思路：推入栈 -> 执行队列
*/
function qpsLimit(requestPipe, limitMax = 3) {
    const reqPool = []

    // 将 promise 推入并发池
    const add = () => {
        const _req = requestPipe.shift()
        reqPool.push(_req)
    }

    // 执行请求队列 - 递归调用自己
    const run = () => {
        if(!requestPipe.length) return
        // 执行栈满后，直接 race
        const _finsh = Promise.race(reqPool)
        _finsh.then(res => {
            // indexOf 实际场景要准确处理
            const _done = reqPool.indexOf(_finsh)
            reqPool.splice(_done, 1)
            add() // race 了一个，所以在此推入新的
        })
        run()
    }

    // 执行栈短则递归推入任务
    while(reqPool.length < limitMax) {
        add()
    }
    // 任务满 - 开始执行
    run()
}