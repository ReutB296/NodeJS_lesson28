"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isElement = exports.isNil = exports.isNull = exports.isUndefined = exports.isBoolean = exports.isNumber = exports.isString = exports.isPlainObject = exports.isFunction = exports.typeChecking = void 0;
var constants_1 = require("../common/constants");
/**
 * 类型检测
 * @param value 目标值
 * @param type 预期类型
 */
function typeChecking(value, type) {
    // 直接使用 toString.call(value) 在 ie 会下报错
    return Object.prototype.toString.call(value) === type;
}
exports.typeChecking = typeChecking;
/**
 * 检测 value 是否为函数
 */
function isFunction(value) {
    return typeChecking(value, '[object Function]');
}
exports.isFunction = isFunction;
/**
 * 检测 value 是否为纯对象，即 {} 或 new Object() 创建的对象
 * 参见 https://lodash.com/docs/4.17.15#isPlainObject
 */
function isPlainObject(value) {
    if (!typeChecking(value, '[object Object]')) {
        return false;
    }
    // 过滤 Object.create(null)
    var proto = Object.getPrototypeOf(value);
    if (proto === null) {
        return true;
    }
    // 过滤 Object.create({}) 与 new Foo()
    var Ctor = Object.hasOwnProperty.call(proto, 'constructor') && proto.constructor;
    return (typeof Ctor === 'function' &&
        Ctor instanceof Ctor &&
        constants_1.funcToString.call(Ctor) === constants_1.objectCtorString);
}
exports.isPlainObject = isPlainObject;
/**
 * 检测 value 是否为字符串
 */
function isString(value) {
    return typeof value === 'string';
}
exports.isString = isString;
/**
 * 检测 value 是否为数值
 */
function isNumber(value) {
    return typeof value === 'number';
}
exports.isNumber = isNumber;
/**
 * 检测 value 是否为布尔值
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}
exports.isBoolean = isBoolean;
/**
 * 检测 value 是否为 Undefined
 */
function isUndefined(value) {
    return value === undefined;
}
exports.isUndefined = isUndefined;
/**
 * 检测 value 是否为 Null
 */
function isNull(value) {
    return value === null;
}
exports.isNull = isNull;
/**
 * 检测 value 是否为 Undefined 或者 Null
 */
function isNil(value) {
    return isUndefined(value) || isNull(value);
}
exports.isNil = isNil;
/**
 * 检测 value 是否为 DOM 元素
 */
function isElement(value) {
    // 1、document(nodeType: 9) 元素不能判断为 element，因为它没有很多 element 该有的属性，
    // 比如：getComputedStyle 获取不到它的宽高，就会报错。
    // 2、当传入 0 的时候，不加 !! 会返回 0，而不是 Boolean 值
    return !!(value && value.nodeType === 1);
}
exports.isElement = isElement;
