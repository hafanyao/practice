/*
    写一个函数，返回一个数组，包含 2 ～ 32 间的随机整数(不能重复)，
    这个函数还可以传入一个参数，参数是几，返回的数组长度就是几
*/

/*** 解法一 ***/
const randomArr = (num) => {
    let arr = []
    for (let i = num; i-- > 0;) {
        // console.log(Math.round(Math.random() * 30))
        arr.push(Math.round(Math.random() * 10000 + 2))
    }
    arr = [...new Set(arr)]
    let len = arr.length
    while (num - len > 0) {
        arr = [...new Set(arr.concat(randomArr(num - len)))]
        len = arr.length
    }
    return arr
}
// console.time()
// console.log(randomArr(10000))
// console.timeEnd() // 6.741s

/*
    问题：
        有点像是暴力破解的感觉，效率很差。
        比如我在函数里传入 30，从 2 ～ 32 总共也就 30 个数，你想想生成随机数的这个方法会运行多少次，
        假如足够幸运，第一次运行函数就生成了 29 位不同数字的数组，那么还差一位就齐了，
        你想想最后这一位重复的几率有多大？是不是30分之29？重复一次就要再运行一遍、重复一次再运行… 
        每次都要新建数组然后再新建 Set 再转回数组，开销很大的，你有没有什么想优化的点？
*/



/*** 解法二 ***/
/*
    事先定义一个里面装着从 2 ~ 32 范围内的所有整数，然后再定义一个空数组用来存放结果，
    在数组的长度(length)范围内随机生成整数，用这个生成出来的整数当作下标从那个数组中取出数字来放入空数组中，
    这样即使生成出来的随机数有重复项也没有关系，因为这两个数组不会有重复项：
*/

const randomArr2 = (num) => {
    const allNums = Array.from({ length: 10001 }, (_, i) => i + 2)
    const result = []
    for (let i = num; i-- > 0;) {
        result.push(
            allNums.splice(Math.floor(Math.random() * allNums.length), 1)[0]
        )
    }
    return result
}
console.time()
console.log(randomArr2(10000))
console.timeEnd() // 21.913ms

/*
    问题：
        这个函数封装的还不够彻底，因为生成从几到几的随机数完全是写死在函数内部的，
        如果不想要生成从 2 ~ 32 的随机数的话还需要去函数内部改代码，这明显是不符合开放封闭原则的，
        并且用起来也不够灵活，咱们来再次封装一下，令其成为一个更加通用的函数：
*/



/*** 解法三 ***/
const randomArr3 = (len, from = 0, to = 100) => {
    const allNums = Array.from({ length: to - from }, (_, i) => i + from)
    const result = []
    for (let i = len; i-- > 0;) {
        result.push(
            allNums.splice(Math.floor(Math.random() * allNums.length), 1)[0]
        )
    }
    return result
}

/*
    问题：
        假如从 0 ～ 10000 里随机生成 10 个不重复的数字，在范围这么大的情况下重复的几率是不是就很低了？
        所以第一种方案很可能只需要生成十个随机数就满足需求了。但如果是第二种方案的话：先要生成一个从 0 ～ 10000 的数组，
        这个数组太大了，但是却只需要其中的 10 个数，有点像是高射炮打蚊子、杀鸡焉用宰牛刀的感觉，
        只有在范围内占比越大的情况下，第二种函数才越合适。如果想封装得更完美一点的话，可以给大家提供个思路：
*/



/*
    用 to - from 除以 len 的值，就是比例了。比如从 0 ～ 10000 里获取 10 个数，
    就相当于 10 / 10000，也就是千分之一，这种情况下就用第一种函数去获取随机数、
    而如果是从 0 ～ 10000 里获取 3000 个数，就是十分之三的比例，此时用第二种函数会更加合适一点：
*/

const randomArr4 = (len, from = 0, to = 100) => {
    const ratio = (to - from) / len
    let result = []
    if (ratio > 0.3) {
        const allNums = Array.from({ length: to - from }, (_, i) => i + from)
        for (let i = len; i-- > 0;) {
            result.push(allNums.splice(Math.floor(Math.random() * allNums.length), 1)[0])
        }
    } else {
        for (let i = len; i-- > 0;) {
            result.push(Math.round(Math.random() * to + from))
        }
        result = [...new Set(result)]
        let length = result.length
        while (len - length > 0) {
            result = [...new Set(result.concat(fn(len - length, from, to)))]
            length = result.length
        }
    }
    return result
}
