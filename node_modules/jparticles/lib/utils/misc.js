"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadImage = exports.merge = void 0;
var checking_1 = require("./checking");
/**
 * 深拷贝，浅拷贝请使用 Object.assign 或 ECMAScript 扩展运算符
 * 1、API 参考 jQuery 深拷贝 https://api.jquery.com/jQuery.extend/#jQuery-extend-deep-target-object1-objectN
 * 2、数组合并采用替换方式，如
 *   merge({ a: [1, 2, 3] }, { a: [9, 8] }) => { a: [9, 8, 3] }
 */
function merge() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var length = objects.length;
    var target = objects[0] || {};
    for (var i = 0; i < length; i++) {
        for (var prop in objects[i]) {
            var value = objects[i][prop];
            var copyIsArray = Array.isArray(value);
            if (copyIsArray || checking_1.isPlainObject(value)) {
                var src = target[prop];
                if (copyIsArray) {
                    src = Array.isArray(src) ? src : [];
                }
                else {
                    src = checking_1.isPlainObject(src) ? src : {};
                }
                target[prop] = merge(src, value);
            }
            else {
                target[prop] = value;
            }
        }
    }
    return target;
}
exports.merge = merge;
/**
 * 加载图像
 * @param url 图像地址
 * @param successCallback 加载成功的回调函数
 * @param errorCallback 加载失败的回调函数
 */
function loadImage(url, successCallback, errorCallback) {
    var image = new Image();
    image.addEventListener('load', function () { return successCallback(image); });
    image.addEventListener('error', function (e) { return errorCallback === null || errorCallback === void 0 ? void 0 : errorCallback(e); });
    image.src = url;
}
exports.loadImage = loadImage;
