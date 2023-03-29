
// 基于URL或者Crypto.getRandomValues生成UUID
// URL.createObjectURL 产生的地址为 blob:https://xxx.org/cb48b940-c625-400a-a393-176c3635020b, 其后部分就是一个UUID
function genUUID() {
    const url = URL.createObjectURL(new Blob([]));
    // const uuid = url.split("/").pop();
    const uuid = url.substring(url.lastIndexOf('/')+ 1);
    URL.revokeObjectURL(url);
    return uuid;
}
genUUID() // cd205467-0120-47b0-9444-894736d873c7

function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16))
}

uuidv4() // 38aa1602-ba78-4368-9235-d8703cdb6037