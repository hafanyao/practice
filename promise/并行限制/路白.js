function limitLoad(urls, handler, limit) {
    let promises = []
    const sequence = [...urls]
    promises = sequence.splice(0, limit).map((url, index) => {
        return handler(urls[index]).then(() => {
            return index
        })
    })
    let p = Promise.race(promises)
    for(let i = 0; i <= sequence.length; i++) {
        p = p.then(res => {
            promises[res] = handler(sequence[i]).then(() => {
                return res
            })
            return Promise.race(promises)
        })
    }
}
const urls = [
    {info: 'aaa.png', time: 1000},
    {info: 'bbb.png', time: 5000},
    {info: 'ccc.png', time: 3000},
    {info: 'ddd.png', time: 7000},
    {info: 'eee.png', time: 2000},
    {info: 'fff.png', time: 3000},
]
function loadImg(url) {
    return new Promise((resolve, reject) => {
        console.log(url.info, '--- start')
        setTimeout(() => {
            console.log(url.info, '--- end')
        }, url.time)
    })
}
limitLoad(urls, loadImg, 3)