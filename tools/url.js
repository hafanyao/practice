console.log(location.search)

function getQueryString(key) {
    const urlSP = new URLSearchParams(location.search);
    return urlSP.get(key)
};


function getQueryString2(key) {
    const urlObj = new URL(location.href);
    return urlObj.searchParams.get(key)
};
// const log = console.log;
// getQueryString
// console.log("pid", getQueryString("pid")); // pid 10
// console.log("cid", getQueryString2("cid")); // cid null


//************** 检查有效URL ***************//
const isValidURL = (url) => {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
};
isValidURL("https://dev.to"); // true
isValidURL("https//invalidto"); // false


//************** 查询字符串生成路径 ***************//
const generatePathQuery = (path, obj) =>
    path + Object.entries(obj)
        .reduce((total, [k, v]) => (total += `${k}=${encodeURIComponent(v)}&`), "?")
        .slice(0, -1);
generatePathQuery("/user", { name: "Orkhan", age: 30 }); 
// "/user?name=Orkhan&age=30"

const getQueryParams = url =>
    url.match(/([^?=&]+)(=([^&]*))/g).reduce((total, crr) => {
        const [key, value] = crr.split("=");
        total[key] = value;
        return total;
    }, {});
getQueryParams("/user?name=Orkhan&age=30");
// { name: 'Orkhan', age: '30' }
