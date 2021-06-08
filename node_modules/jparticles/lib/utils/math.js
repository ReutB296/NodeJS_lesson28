"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcQuantity = exports.radiansToDegrees = exports.degreesToRadians = void 0;
var constants_1 = require("../common/constants");
/**
 * 角度转弧度
 */
function degreesToRadians(degrees) {
    return degrees * constants_1.piBy180;
}
exports.degreesToRadians = degreesToRadians;
/**
 * 弧度转角度
 */
function radiansToDegrees(radians) {
    return radians / constants_1.piBy180;
}
exports.radiansToDegrees = radiansToDegrees;
/**
 * 根据「原始值」及「范围值」计算数量
 * 当原始值为 (0, 1) 时，返回原始值与范围值的倍数
 * 当原始值为 0 或 [1, +∞) 时，返回原始值
 * @param value  原始值
 * @param range  范围值
 */
function calcQuantity(value, range) {
    return value > 0 && value < 1 ? value * range : value;
}
exports.calcQuantity = calcQuantity;
