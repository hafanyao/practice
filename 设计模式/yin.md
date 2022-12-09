### 设计模式

## 基础概念

# 什么是设计模式
针对设计问题的通用解决方案

# 学习设计模式的原因
1. 有利于代码复用
2. 有利于代码稳定可拓展
3. 有利于代码可读性提升

# 什么时候需要设计模式
1. 优先考虑全局设计
2. 合理权衡使用需求和维护成本
    - 开发成本/维护成本，不是所有项目都需要设计模式

# 掌握程度
1. 什么是设计模式 -> 展现出有使用设计模式的概念 -> 有经验
2. 清楚的概念 -> 了解基本设计模式分类《前端设计模式》
3. 不同场景下关联到设计模式 -> 目的是合理使用



## 设计模式原则

# 开闭原则（OCP）：开放-拓展，关闭-修改
# 开闭原则：‘大’ 和 ‘小’ 把每个模块拆分出来，组合成整体
- 目标：已有场景下，对于需要拓展的功能进行开放，拒绝直接的对于系统功能进行修改
```js
    // 开闭原则
    if(game === 'basketball') {
    }else if(game === 'puke') {
        console.log('打牌')
    }else...

    /*** 重构 - 1 ***/
    gemeManger(game).basketball()
    gemeManger(game).puke()
    // game 库
    function gameManger(game) {
        return `${game}`Manger
    }

    /*** 重构 2 - 抽离公共逻辑 ***/
    class game {
        constructor(game) {
            this.game = game
        }
        puke() {
            console.log('打牌')
        }
    }
    class football extends game {
        basketball() {
            console.log('足球')
        }
    }
    class basketball extends game {
        basketball() {
            console.log('篮球')
        }
    }
    /*
        常见于流式处理上，例如字符串：
        yao@man@1994@28 => 姚/男/1994/28
        特点：链式结构
        缺点：下个需求进来还需要再写一个新的链式结构
        所以：转换思路 => 拆分 + 排序 + 翻译 => 函数式编程
    */
```


# 单一职责原则（SRP）：岗位职责要单一，同时互不重叠（拆成最小粒度）
# 单一职责：小模块之间不应该有功能重合，如果有重合可以把两个模块拆分开
- 目标：一个功能模块只做一件事情
```js
    class gameManger {
        basketball() {
            console.log('篮球')
            drink() // 喝水
        }
    }
    const game = new gameManger()
    game.basketball() // 问题：做了两件事，存在功能耦合

    /* 重构 */
    // gameManger.js 业务
    class gameManger {
        constructor(command) {
            this.command = command
        }
        basketball(water) {
            console.log('篮球')
            // 作为命令去执行
            this.command.drink(water) // 喝水
        }
    }
    // drinkWater.js 工具 -- 拆分‘喝水’的功能，与游戏没有关联
    class drinkWater {
        drink(water) {
            console.log(water) // 喝水
        }
    }
    // main.js 执行
    const exe = new drinkWater()
    const game = new gameManger(exe)
    game.basketball('橙汁')
    /*
        常见于模块/组件，例如‘弹框’ => slot(HOC)：
    */
```


# 依赖倒置原则（DIP）：上层实现不应该依赖下层细节
# 依赖倒置：上下两个功能，一个依赖另一个的时候，被依赖者需要提供更多动态的能力，
# 让上层应用在实现的过程中，不要依赖底层的实现，不要让底层一直配合去改
- 目标：上层应用面向抽象进行 codeing，而不是面向实现 -> 降低需求与实现的耦合
```js
    // 需求：分享功能
    class store {
        constructor() {
            this.share = new Share()
            this.rate = new Rate()
        }
    }
    class Share {
        shareTo(platform) {
            // 分享
        }
    }
    const store = new Store()
    store.share.shareTo('wx')
    // 评分功能
    class Rate {
        star(stars) {
            // 评分
        }
    }
    store.rate.star('wx')
    /*
        ^问题点：把整个功能类的实现给暴露了，把 share 挂在了 store 上
        目标：初始化 store 的时候 share/rate 先不要，用到的时候按需动态挂载（底层不变，动态挂载）
    */
    // 重构
    class Rate {
        // 初始化动作
        init(store) {
            // 把自己挂在 store 实例的 rate 上
            store.rate = this
        }
        store(stars) {
            // 评分
        }
    }
    class Share {
        // 初始化动作
        init(store) {
            // 把自己挂在 store 实例的 rate 上
            store.share = this
        }
        shareTo(platform) {
            // 分享
        }
    }
    class Store {
        // 维护模块名单
        static modules = new Map()
        constructor() {
            // 遍历名单 + 做初始化挂载
            for(let module of Store.modules.value()) {
                // 类的 this 指向它生成的实例 ***
                module.init(this) // 唯一和业务功能有关系的一行代码
            }
        }
        // 提供注入功能模块
        static inject(module) {
            Store.modules.set(module.constructor.name, module)
        }
    }
    // 调用
    const rate = new Rate()
    Store.inject()
    // 初始化商城
    const store = new Store()
    store.rate.star(5)
    /*
        常见于依赖收集，准确的说是依赖被收集，自己选择队列排队
    */
```


# 接口隔离原则（ISP）：对外沟通通道
- 目标：多个专业接口比单个胖接口好用（返回很多数据，外层会接收很多无用信息）
```js
    // 游戏中台 - 快速生产游戏
    class Game {
        constructor(name) {
            this.name = name
        }
        run() {
            // 跑
        }
        shot() {
            // 射击
        }
        mega() {
            // 大招
        }
    }
    // 魂斗罗
    class HunD extends Game {
        constructor() {
            // 
        }
    }
    const HDL = new HunD()
    HDL.run()
    HDL.shot()
    HDL.mega() // ？？？
    /*
        ^问题点：魂斗罗为什么会有‘大招’，因为继承了游戏中台，实际是多余的
        重构：用多个接口替代，每个接口服务于一个子模块
    */
    class Game {
        constructor(name) {
            this.name = name
        }
        run() {
            // 跑 - 真正公用
        }
    }
    // 射击类游戏
    class FPS {
        aim() {}
    }
    // 格斗类游戏
    class MOBA {
        TP() {}
    }
    // 魂斗罗需要‘射击’功能
    class HunD extends Game {
        shot() {
            // 射击
        }
    }
    /*
        常见于重构组件/细化组件 + 状态机，命名空间
        对于接口的抽离：层级深度 + 划分 -> 解决 ‘接口过胖/广度过宽’ 的问题
    */
```


# 里氏替换原则（LSP）：父类在生成子类的时候，子类是可以被拓展的，但是不应该随意改变
# 子类可以覆盖父类 => 子类出现的地方子类一定能出现(希望属性和调用的方法对外保持统一)
- 不应当在继承过程中把原有的东西丢掉（父亲勤劳肯干，我不能好吃懒惰）
```js
    class Game {
        start() {
            // 开机
        }
        off() {
            // 关系
        }
        play() {
            // 开始游戏
        }
    }
    // pc游戏
    const game = new Game()
    game.lay()
    // 移动游戏继承pc游戏
    class MobileGame extends game {
        tomStore() {}
        play() {
            // 重写开始游戏
        }
    }
    const mobile = new MobileGame()
    mobile.play()
    /*
        问题：修改 play 要修改两个方法，继承链混乱（本身和父类）
        所以：应该拓展不应该重写 play 方法
    */
   // 重构
   // 1. 取出通用方法
   class Game {
        start() {
            // 开机
        }
        off() {
            // 关系
        }
        
    }
    // 子类分开继承，也就是避免同方法的交叉
    class MobileGame extends game {
        tomStore() {}
        play() {
            // 重写开始游戏
        }
    }
    class PCGame extends Game {
        speed() {
            // 加速器
        }
        play() {
            // PC游戏
        }
    }
    /*
        维护核心的同时也要让核心减负，增加分层
        拆分的过程也就是一个思路，不停提升核心的重要性，核心越来约复杂
        因为我们需要核心提供更多动态东西，给外面更多的可能性，也就是‘中台思路’ ***
        让中台越累越复杂，越来越通用，越来越整合，让内部更模块化，有利于各业务线发展
        中台业务是各业务线接入点，为各业务提供了很多臃肿的兜底和兼容
        ‘拆中台’ => 把原本中台的业务按层级去进一步拆分，不一定所有功能都放在中台，只放最核心的
        中间层/转译层/胶水层去做对应功能，再去做业务侧接入，‘拆中台’不是‘拆掉’是‘拆开’
    */
```







