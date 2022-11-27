01. 请简述你对 react 的理解
    - react 是一个用于构建用户界面的 js 库
    - 特点：声明式设计：react 采用范式声明，开发者只需要声明显示内容，react 就会自动完成
    - 高效：react 通过对 dom 的模拟（也就是虚拟 dom）最大限度的减少与 dom 的交互
    - 灵活： react 可以和已知的库或者框架很好配合
    - 组件： 通过 react 构建组件，让代码更容易复用，能够很好应用在大型项目开发中，把页面功能拆分成小模块，每个小模块就是组件
    - 单向数据流：react 是单向数据流，数据通过 props 从父节点传递到子节点，如果父级的某个 props 改变了，react 会重新渲染所有的子节点



02. 调用 setState 之后发生了什么
    - React 在调用 setstate 后，react 会将传入的参数对象和组件当前的状态合并，触发调和过程，
    - 在调和过程中，react 会根据新的状态构建 react 元素树重新渲染整个 UI 界面，在得到元素树之后，react 会自动计算新老节点的差异，根据差异对界面进行最小化重新渲染



03. react 生命周期函数
    - componentWillMount 组件渲染之前调用
    - componentDidMount 在第一次渲染之后调用
    - componentWillReceiveProps 在组件接收到一个新的 props 时调用
    - shouldComponentUpdate 判断组件是否更新 html
    - componentWillupdate 组件即将更新 html 时调用
    - componentDidupdate 在组件完成更新后立即调用
    - componentWillUnmount 在组件移除之前调用

    1. react.memo() 类似于纯组件，在无状态组件中使用
    2. shouldcomponentupdate 在渲染前进行判断组件是否更新，更新了再渲染
    3. purecomponent（纯组件）省去了虚拟 dom 生成和对比的过程，在类组件中使用



04. hooks 有什么优/缺点
    # 优点
    1. 大大增加了逻辑的复用性、灵活性、可维护性，一个钩子也可以多次使用
    2. 组合: Hooks 中可以引用另外的 Hooks 形成新的 Hooks，组合变化万千
    3. 函数友好: React Hooks为函数组件而生，从而解决了类组件的几大问题:
        - this 指向容易错误
        - 代码复用成本高(高阶组件容易使代码量剧增)
        - 分割在不同声明周期中的逻辑使得代码难以理解和维护
        - hooks使组件拥有了复用“生命周期”的能力，可以返回任意类型的数据
    4. 解耦: React Hooks 可以更方便地把‘UI’和‘状态’分离，做到更彻底的解耦
    5. 简洁: React Hooks 解决了 HOC 和 Render Props 的嵌套问题，更加简洁 – 状态共享
    6. 给函数组件加上了状态(state)，一个React组件就是一个JavaScript函数，更容易复用代码和抽取逻辑 
    
    # 缺点
    1. 写法上有限制(不能出现在条件、循环中)，增加了重构成本
        - 数组依赖容易忽略（与Vue3比起来确实算是个劣势）
        - 依赖的声明如果是引用类型数据，要注意避免字面量，否则易导致死循环
    2. useEffect 容易形成依赖链，不易维护，尽量实现‘单一职责模式’
        - 不要在 useEffect 里写太多依赖项，划分这些依赖项成多个单一功能的 useEffect（单一职责模式）
    3. 内部实现上不直观(依赖一份可变的全局状态，不再那么“纯”)
    4. 状态不同步，闭包场景可能会引用到旧的 state、props 值
        - 函数的运行是独立的，每个函数都有独立的作用域。函数的变量是保存在运行时的作用域里面，当我们有异步操作的时候，经常会碰到异步回调的变量引用是旧的（可以理解成闭包）
    5. hooks不太好类比calss组件生命周期，虽然可以用 useEffect 模拟部分生命周期
    6. React.memo 并不能完全替代 shouldComponentUpdate(因为拿不到 state change，只针对 props change)
    7. 破坏了 PureComponent、React.memo 浅比较的性能优化效果(为了取最新的props和state，每次render都要重新创建事件处函数)
    


05. redux 的设计原理是什么，如何与 react 结合起来
    - 创建全局 store 保存 state 以及‘更新状态的方法’
    - 订阅 react 更新，使用 context api 实现跨组件状态传递
    - react-redux 作为桥梁，将二者结合(简化 API 写法)
    - redux 推崇；单向数据流‘和‘状态不可变’(immutable)
    - 触发状态更新的顺序为：组件 => action => reducer => state => 组件



06. redux，react-redux 的 API
    createStore，
    applyMiddleware
    combineReducers
    bindActionCreators……
    useSelector，useDispatch……
    connect(mapStateToProps, mapDispatchToProps)



07. 对有状态组件和无状态组件的理解及使用场景
## 有状态组件 
- 特点： 
    1. 是类组件
    2. 有继承
    3. 可以使用this
    4. 可以使用react的生命周期
    5. 使用较多，容易频繁触发生命周期钩子函数，影响性能
    6. 内部使用 state，维护自身状态的变化，有状态组件根据外部组件传入的 props 和自身的 state进行渲染。
- 使用场景：
    1. 需要使用到状态的
    2. 需要使用状态操作组件的（无状态组件的也可以实现新版本react hooks也可实现）
- 总结：
    类组件可以维护自身的状态变量，即组件的 state ，类组件还有不同的生命周期方法，可以让开发者能够在组件的不同阶段（挂载、更新、卸载），对组件做更多的控制。类组件则既可以充当无状态组件，也可以充当有状态组件。当一个类组件不需要管理自身状态时，也可称为无状态组件。

## 无状态组件
- 特点：
    1. 不依赖自身的状态state
    2. 可以是类组件或者函数组件
    3. 可以完全避免使用 this 关键字。（由于使用的是箭头函数事件无需绑定）
    4. 有更高的性能。当不需要使用生命周期钩子时，应该首先使用无状态函数组件
    5. 组件内部不维护 state ，只根据外部组件传入的 props 进行渲染的组件，当 props 改变时，组件重新渲染。
- 使用场景：组件不需要管理 state，纯展示
- 优点：
    1. 简化代码、专注于 render
    2. 组件不需要被实例化，无生命周期，提升性能。 输出（渲染）只取决于输入（属性），无副作用
    3. 视图和数据的解耦分离
- 缺点：
    1. 无法使用 ref
    2. 无生命周期方法
    3. 无法控制组件的重渲染，因为无法使用shouldComponentUpdate 方法，当组件接受到新的属性时则会重渲染  
- 总结：
    组件内部状态且与外部无关的组件，可以考虑用状态组件，这样状态树就不会过于复杂，易于理解和管理。当一个组件不需要管理自身状态时，也就是无状态组件，应该优先设计为函数组件。比如自定义组件。



08. react.Component 和 react.PureComponent 的区别
    1. PureComponent 表示一个纯组件，可以减少 render 函数执行的次数，从而提高组件的性能
    2. 当 prop/state 发生变化，可以在 shouldComponentUpdate 中执行 return false 阻止页面更新，从而减少不必要的 render 执行
    3. React.PureComponent 会自动执行 shouldComponentUpdate。不过 pureComponent 中的 shouldComponentUpdate() 进行的是浅比较，也就是说如果是引用数据类型的数据，只会比较不是同一个地址，而不会比较这个地址里面的数据是否一致
    4. 浅比较会忽略属性和或状态突变情况，其实也就是数据引用指针没有变化，而数据发生改变的时候 render 是不会执行的，如果需要重新渲染那么就需要重新开辟空间引用数据
    5. PureComponent 一般会用在一些纯展示组件上
    6. 使用pureComponent的好处：当组件更新时，如果组件的 props/state 都没有改变，render 就不会触发。省去虚拟 DOM 的‘生成和对比’过程，达到提升性能的目的，这是因为 react 自动做了一层浅比较



09. 函数组件怎么实现 shouldComponentUpdate - 优化
    - shouldComponentUpdate 的作用是当 props 和 state 发生改变时，shouldComponentUpdate()会在渲染之前被调用，默认的返回值是 true，当返回值为 false 时，将会阻止本次渲染
    - 函数组件中，要阻止组件重新渲染就需要使用到React.memo()，memo 类似高阶组件，但只适用函数组件
    - shouldComponentUpdate()和memo() 的返回值相反，shouldComponentUpdate()返回false会跳过渲染，而React.memo()是在返回 true 的情况下才跳过渲染
    - React.memo() 并‘不是阻断渲染’，而是‘跳过渲染组件’直接复用最近一次渲染的结果，这与 shouldComponentUpdate() 是完全不同的



10. useEffect 模拟生命周期
    - useEffect 的依赖项是做浅比较，比较对象类型的话，需要用 JSON.stringfy 进行转换
    ```js
        // 模拟 class 组件的 componentDidMount 和 componentDidUpdate
        // 第一个参数执行函数，第二个参数不传
        useEffect(() => {
            console.log('DidMount 和 DidUpdate')
        })
    
        // 模拟 class 组件的 componentDidMount
        // 第一个参数执行函数，第二个参数传空数组[]
        useEffect(() => {
            console.log('加载完了componentDidMount')
        }, []) // 第二个参数是 [] （不依赖于任何 state）
    
        // 模拟 class 组件的 componentDidUpdate
        // 第一个参数执行函数，第二个参数传state数组
        useEffect(() => {
            console.log('更新了')
        }, [count, name]) // 第二个参数就是依赖的 state
    
        // 模拟 class 组件的 componentDidMount 和 componentWillUnmount
        useEffect(() => {
            let timerId = window.setInterval(() => {
                console.log(Date.now())
            }, 1000)
    
            // 返回一个函数
            // 模拟 componentWillUnmount 组件销毁的时候 停止计时器
            return () => {
                window.clearInterval(timerId)
            }
        }, [])

    ```



11. useMemo 和 useCallback 的区别
    - useMemo 返回具体的值
    - useCallback 返回一个函数
    ```js
        const show = useCallback(() => {
            console.log(count) // 否则 state 中其他值的变化也会触发
        }, [count])
    ```