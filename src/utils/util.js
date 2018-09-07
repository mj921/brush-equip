// 深拷贝
export const deepCopy = (obj) => {
    var o = obj instanceof Array ? [] : {};
    for (var key in obj) {
        if (typeof obj[key] === "object") {
            o[key] = deepCopy(obj[key]);
        } else {
            o[key] = obj[key];
        }
    }
    return o;
}
// 去数组两个数之间的随机数
export const probRandom = (arr) => {
    return Math.floor(Math.random() * (arr[1] - arr[0])) + arr[0];
}