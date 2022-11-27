/*
    麓一
    手写函数：input -> array
    输出：item 去 0，* 2
*/
    const array = [0, 2, 3, 5, 6, 8]
    function generatorArr(arr) {
        const res = []
        for (let i = 0; i < arr.length; i++) {
            if(arr[i]) res.push(arr[i] * 2)
        }
        return res
    }
    /*
        热身 - 50分
        一个纬度：增加深度 - 算法
        另一维度：增加扩展性 - 设计
    */

    function generatorArr2(num) {
        return function(arr) {
            const res = []
            for (let i = 0; i < arr.length; i++) {
                if(arr[i]) res.push(arr[i] * num)
            }
            return res
        }
    }
    const generatorArr2_1 = generatorArr2(3)
    // 65分
    console.log(generatorArr2_1(array));
    console.log(generatorArr(array));




    /*
        标准答案 ***
        函数式编程 - compose 是非常重要的概念
        redux-compose / applyMiddleWare
        arr.pipe().pipe().pipe() => newArr
    */
    const filterArr = arr => arr.filter(Boolean)
    // 筛选器
    const filterBigger = num => arr => arr.filter(item => item > num)
    const filterBigger10 = filterBigger(10)
    // 乘法器
    const multipty = num => arr => arr.map(item => item * num)
    const multipty2 = multipty(2)
    const multipty3 = multipty(3)

    /*
        大厂 compose 可以是单独考题，代表 coder 思想 ***
        函数编排：fn1,fn2,fn3 --> fn3(fn2(fn1(startNum)))
    */
    //              rest: [fn1, fn2, fn3]                                 fn1(startNum) -> res1
    const compose = (...rest) => startNum => rest.reduce((total, item) => item(total), startNum)
    
    const modifyArr = compose(filterArr, multipty2, filterBigger10)
    const modifyArr3 = compose(filterArr, multipty3, filterBigger10)
    console.log('---', modifyArr(array));
    console.log('---', modifyArr3(array));




    // 新需求，增加一个函数，对每一位 *3
    function generatorArr_1(array, handle) {
        const res = []
        for (let i = 0; i < array.length; i++) {
            if(array[i]) res.push(handle(array[i]))
        }
        return res 
    }
    function m3(num) {
        return num * 3
    }
    console.log(generatorArr_1(array, m3));
    