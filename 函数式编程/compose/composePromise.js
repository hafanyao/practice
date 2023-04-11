/*
    https://juejin.cn/post/6989020415444123662
    Promise 可以指定一个 sequence，来规定一个执行 then 的过程，
    then 函数会等到执行完成后，再执行下一个 then 的处理。
    启动sequence 可以使用 Promise.resolve() 这个函数。
    构建 sequence 可以使用 reduce 
*/
const composePromise = function (...args) {
	const init = args.pop()
	return function (...arg) {
		return args.reverse().reduce(function (sequence, func) {
			return sequence.then(function (result) {
				return func.call(null, result)
			})
		}, Promise.resolve(init.apply(null, arg)))
	}
}

const a = async () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('xhr1')
			resolve('xhr1')
		}, 5000)
	})
}

const b = async () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			console.log('xhr2')
			resolve('xhr2')
		}, 3000)
	})
}

const steps = [a, b] // 从右向左执行
const composeFn = compose(...steps)

composeFn().then((res) => {
	console.log(666)
})

// xhr2
// xhr1
// 666



/**
* 新建应用流程
* 入参: item
* 输出：item
*/
function compose_newAppIframe(...args) {
    const steps = [this.step_getDoclose, this.step_createWs, this.step_splitUrl, this.step_appH5create, this.step_getsingleSignOnToken]
    const handleCompose = composePromise(...steps)
    handleCompose(...args)
}

/**
* 编辑应用流程
* 入参: item, draftH5Id, editUrl
* 输出：item
*/
function compose_editAppIframe(...args) {
    const steps = [this.step_getDoclose, this.step_createWs, this.step_splitUrl, this.step_getsingleSignOnToken]
    const handleCompose = composePromise(...steps)
    handleCompose(...args)
}

/**
* 重新创建流程
* 入参: item，draftH5Id，version
* 输出：item
*/
function compose_reNewAppIframe(...args) {
    const steps = [this.step_getDoclose, this.step_createWs, this.step_splitUrl, this.step_appH5create, this.step_getsingleSignOnToken, this.step_delDraftH5Id]
    const handleCompose = composePromise(...steps)
    handleCompose(...args)
}

/*
    通过 composePromise 执行不同的 steps，依次执行（从右至左）里面的功能函数；
    可以任意组合、增删或修改 steps 的子项，也可以任意组合出新的流程来应付产品。
    并且，它们都被封装在 compose_xxx 里面，相互独立，不会干扰外界其它流程。
    同时，传参也是非常清晰的，输入是什么！输出又是什么！一目了然
*/