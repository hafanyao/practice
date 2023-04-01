function runPromises(promiseCreators, initData) {
    return promiseCreators
        .reduce((promise, next) => promise
                .then((data) => next(data))
            , Promise.resolve(initData));
}

var promise1 = function (data = 0) {
    return new Promise(resolve => {
        resolve(data + 1000);
    });
}
var promise2 = function (data) {
    return new Promise(resolve => {
        resolve(data - 500);
    });
}

// runPromises([promise1, promise2], 1).then(res=>console.log(res))

function factorial (num, total) {
    if (num === 1) return total;
    console.log(factorial(num - 1, num * total));
    return factorial(num - 1, num * total);
}
console.log(factorial(5, 1));