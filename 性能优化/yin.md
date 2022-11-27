<!-- https://applnzi6vl27059.pc.xiaoe-tech.com/live_pc/l_624802fbe4b01a4851ec8587 -->
### 一、输入 url 
* URL：对于资源位置的描述
```js
    http://www
    https://www
    file://C:/Users - 本地目录
```
## http
    01. http 是应用层 -> TCP 是传输层协议
    02. http 是基于 TPC 实现连接的 -> 对接服务器通道的过程也就是 TCP
        - 优化点：1.x 升级到 2.0
        - UDP vs TCP
        - keep-alive
        - 2.0 多个并发请求复用同一链路，没有并发限制
    03. http 是无状态连接 -> TCP 连接是有状态的
        - socket 连接，本质是一个封装后的 TCP
# https
    01. https = http + SSL(TLS) -> 位于 TCP 协议与各层协议之间
    02. 实现原理
    03. 缺点：导致网络加载事件延长，增加开销（一系列加密算法）
        - 优化： 合并请求(BFF)、长连接

# 中间层整合请求 - 异常处理（node）

# https 请求流程
    01. 客户端发送请求，服务端接收，返回 第三方证书（包含公钥）
    02. 客户端根据公钥，生成一组随机数并对称加密
    03. 客户端对 ‘对称密钥’ 用公钥再次加密
    04. 客户端发送使用公钥加密后的 ‘对称密钥’
    05. 开始真正的秘文通信

* 域名解析：ARP
    01. 浏览器缓存 - DNS记录 - 域名和 IP 的 map 关系
    02. 系统缓存 - 全局环境变量、mac-User
    03. 本地 HOST 文件 - 切 host
    04. 路由器缓存 - 各级路由器缓存域名信息
    05. 运营商地方站点的缓存记录 (同城市总会有人访问)
    06. 根 DNS域名 服务器(全球13台，固定ip地址)
    
    - 优化
        - CDN 
            01 为同一主机分配多个 IP 地址（04 运营商阶段）
            02 LB - 负载均衡

    - CDN 前端面试方向 - 缓存
    - CDN 加速 - 使⽤内容分发⽹络，让⽤户更快的获取到所要内容

* web 服务器 - apache、ngnix
    01. 接收请求，传递给服务端
    02. 通过反向代理，传递给其他服务器
    03. 不同域名指向同一服务器 - ngnix 域名解析

### 服务涉及的网络优化
* 手写并发 - QPS - 5年高级
```js
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
            const _finsh = Promise.rece(reqPool)
            _finsh.then(res => {
                // indexOf 实际场景要准确处理
                const _done = reqPool.indexOf(_finsh)
                reqPool.splice(_done, 1)
                add() // rece 了一个，所以在此推入新的
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

```

### 浏览器渲染
* 浏览器执行顺序
    - 主线：HTML => DOM => CSSOM => 
            renderTree(深度优先) + js => layout => paint
    - 支线：
        - repaint - 重绘：改变颜色/文本
        - reflow - 重排：改变自身/周边几何布局
    
    - 优化：
        - 减少重绘，避免重排
        - display：none => reflow; visibilty: hidden => repaint;

### js 性能优化 ***
* 
    - 垃圾回收 -> 引用计数/标记清除 - 触达标记，锁定清空，未触达直接抹掉
        - 内存分配：申明变量、函数、对象
        - 内存使用：读写内存
        - 内存释放
```js
    const hafan = {}
    // 建立引用关系
    const _lei = hafan
    // 引用源被替换 - 无法 gc
    hafan = 'win'
    // 深入层级引用
    const _class = _lei.b
    // 引用方替换 - 因为 _class 引用，暂未 gc
    _lei = 'over'
    // 手动 gc
    _class = null
    /*
        1. 对象层级宜平不宜神
        2. 深层引用最好深拷贝，或者手动 gc
        3. 避免循环引用
    */
```

### 打包配置优化
* 
    - 1. 懒加载 - 非必要不加载
    - 2. 按需引入 - 非必要不引入
    - 3. 抽离公共 - 相同项合并公用

