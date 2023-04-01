function getArrays(arr) {
    const res = []
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        const arr2 = arr.filter(i => i !== item)
        for (let k = 0; k < arr2.length; k++) {
            res.push(item + arr2[k])
        }
    }
    return res
}
// console.log(getArrays(["a", "b", "c"]))



const solution = (nums) => {
    let result = []
    const solutionOne = (val = [],arr) => {
        if(arr.length <= 1 ){
            return [...val, ...arr].toString()
            // return [[...val,...arr]]
        }
        const tempResult = []
        for(let i = 0; i< arr.length; i++) {
            let tempArr = JSON.parse(JSON.stringify(arr))
            tempArr.splice(i, 1)
            tempResult.push(solutionOne([...val, arr[i]], tempArr))
        }
        return tempResult
    }
    result = solutionOne([], nums)
    return result
}
// console.log(solution(["a", "b", "c"]))

let array = [1, 2, 3, 4, 5, 6, 7]
delete array[2]
// array.fill("fill", 3)
// array.copyWithin(2, 0)
console.log("array fill:", array)