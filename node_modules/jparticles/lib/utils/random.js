"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomColor = exports.randomSpeed = exports.randomInRange = void 0;
/**
 * 在指定范围内获取随机数
 */
function randomInRange(max, min) {
    return max === min ? max : Math.random() * (max - min) + min;
}
exports.randomInRange = randomInRange;
/**
 * 获取随机速度，取最大或最小速度之间的随机值，并随机赋予正负值
 */
function randomSpeed(maxSpeed, minSpeed) {
    return ((randomInRange(maxSpeed, minSpeed) || maxSpeed) *
        (Math.random() > 0.5 ? 1 : -1));
}
exports.randomSpeed = randomSpeed;
/**
 * 获取随机颜色值，返回 16 进制色值
 */
function randomColor() {
    // http://stackoverflow.com/questions/1484506/random-color-generator-in-javascript
    // prettier-ignore
    return "#" + Math.random().toString(16).slice(-6);
}
exports.randomColor = randomColor;
