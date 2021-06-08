"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upperFirst = exports.trimAll = exports.toFixed = exports.pInt = void 0;
var constants_1 = require("../common/constants");
/**
 * 包装原生 parseInt，确保输出十进制数值
 */
function pInt(s, radix) {
    if (radix === void 0) { radix = 10; }
    return parseInt(s, radix);
}
exports.pInt = pInt;
/**
 * 包装原生 toFixed，确保输出数字而不是字符串
 */
function toFixed(num, digits) {
    if (digits === void 0) { digits = 0; }
    return parseFloat(Number(num).toFixed(digits));
}
exports.toFixed = toFixed;
/**
 * 移除字符串内所有空白，包括空格、空行、制表符
 */
function trimAll(str) {
    return str.replace(constants_1.regExp.trimAll, '');
}
exports.trimAll = trimAll;
/**
 * 将字符串首字母转换成大写
 */
function upperFirst(str) {
    return str[0].toUpperCase() + str.substring(1);
}
exports.upperFirst = upperFirst;
