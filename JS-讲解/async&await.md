
### async
1. async 函数返回值是一个 promise，普通函数加了 async 返回的也是 promise；
2. 对象的状态由函数的返回结果决定，要是非 promise 对象，肯定是成功的状态；
    ```js
        async function xxx() {
            return 1
        }
    ```
3. 如果是 promise 对象，则由执行结果决定，返回值也是里面 promise 对象的值；
    ```js
        async function xxx() {
            return new Promise((resolve, reject) => {
                resolve(1)
            })
        }
    ```
4. async 返回 promise 对象不方便使用，await 用来处理 promise，直接可以拿到真正的值

### await
1. await 必须写在 async 函数中；
2. await 右侧表达式一般为 promise 对象；
3. await 返回的是 promise 成功的值；
4. await 的 promise 异常需要 try catch 捕获；