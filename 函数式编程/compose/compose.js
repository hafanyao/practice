function fn1(x) {
	console.log('---', x)
	return x + 1
}
function fn2(x) {
	console.log('---', x)
	return x + 2
}
function fn3(x) {
	console.log('---', x)
	return x + 3
}
function fn4(x) {
	console.log('---', x)
	return x + 4
}

function compose_1(...fns) {
	// console.log(Array.isArray(rest))
	// fns：[fn_1, fn_2, fn_3] => 函数数组
	return (res) => fns.reduce((total, fn) => fn(total), res)
}

function compose_2() {
	const fns = [...arguments]
	// res 就是上一步结果，当做参数遍历传入下一个函数并返回新的值
	return (res) => fns.reduce((total, fn) => fn(total), res)
	// return res => {
	//     return fns.reduce((total, fn) => fn(total), res)
	// }
}

function compose_3() {
	const fns = [...arguments]
	const res = (res) => fns.reduce((total, fn) => fn(total), res)
	return res
}

function compose_4(...fns) {
	return function composed(res) {
		// 拷贝一份保存函数的数组
		var list = fns.slice()
		while (list.length > 0) {
			// 取出最后一个函数并执行
			res = list.shift()(res)
			console.log(res, '-', list)
		}
		return res
	}
}

// ES6 箭头函数形式写法
var compose_5 =
	(...fns) =>
	(res) => {
		var list = fns.slice()
		while (list.length > 0) {
			// 取出最后一个函数并执行
			res = list.pop()(res)
		}
		return res
	}

const compose_fun1 = compose_1(fn1, fn2, fn3, fn4)
const compose_fun2 = compose_2(fn1, fn2, fn3, fn4)
const compose_fun3 = compose_3(fn1, fn2, fn3, fn4)
const compose_fun4 = compose_4(fn1, fn2, fn3, fn4)
const compose_fun5 = compose_5(fn1, fn2, fn3, fn4)
// console.log(compose_fun1(1)) // num + 1 + 2 + 3 + 4
// console.log(compose_fun2(1)) // num + 1 + 2 + 3 + 4
// console.log(compose_fun3(1)) // num + 1 + 2 + 3 + 4
console.log(compose_fun4(1)) // num + 1 + 2 + 3 + 4




