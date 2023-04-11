function sleepTime (time) {
    const sleep = Date.now() + time * 1000
    while (Date.now() < sleep) {
        console.log('进程等待中...')
    }
    return
}
sleepTime(4)