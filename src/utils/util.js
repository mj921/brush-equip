// 深拷贝
export const deepCopy = obj => {
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
export const probRandom = arr => {
    return Math.floor(Math.random() * (arr[1] - arr[0])) + arr[0];
}
// 毫秒转时间格式
export const millisecondFmt = time => {
    time = Math.floor(time / 1000);
    if (time < 60) {
        return time + " 秒";
    } else if (time < 3600) {
        let m = Math.floor(time / 60);
        let s = time % 60;
        return `${m} 分 ${s} 秒`;
    } else if (time < 86400) {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time - h * 3600) / 60);
        let s = time % 60;
        return `${h} 小时 ${m} 分 ${s} 秒`;
    } else if (time < 86400) {
        let h = Math.floor(time / 3600);
        let m = Math.floor((time - h * 3600) / 60);
        let s = time % 60;
        return `${h} 小时 ${m} 分 ${s} 秒`;
    } else if (time < 365 * 86400) {
        let d = Math.floor(time / 86400);
        let h = Math.floor((time - d * 86400) / 3600);
        let m = Math.floor((time - h * 3600 - d * 86400) / 60);
        let s = time % 60;
        return `${d} 天 ${h} 小时 ${m} 分 ${s} 秒`;
    } else {
        let y = Math.floor(time / 86400 / 365);
        let d = Math.floor((time - y * 86400 * 365) / 86400);
        let h = Math.floor((time - d * 86400 - y * 86400 * 365) / 3600);
        let m = Math.floor((time - h * 3600 - d * 86400 - y * 86400 * 365) / 60);
        let s = time % 60;
        return `${y} 年 ${d} 天 ${h} 小时 ${m} 分 ${s} 秒`;
    }
}