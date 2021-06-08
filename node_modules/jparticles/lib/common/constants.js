"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT_NAMES_WAVE_LOADING = exports.EVENT_NAMES = exports.regExp = exports.isRuntimeSupported = exports.isIE8 = exports.defaultCanvasHeight = exports.defaultCanvasWidth = exports.objectCtorString = exports.funcToString = exports.orientationSupport = exports.doublePi = exports.piBy180 = void 0;
exports.piBy180 = Math.PI / 180;
exports.doublePi = Math.PI * 2;
exports.orientationSupport = !!window.DeviceOrientationEvent;
exports.funcToString = Function.prototype.toString;
exports.objectCtorString = exports.funcToString.call(Object);
exports.defaultCanvasWidth = 485;
exports.defaultCanvasHeight = 300;
exports.isIE8 = /msie\s8.0/i.test(navigator.userAgent);
exports.isRuntimeSupported = !!Object.defineProperty && !exports.isIE8;
// 正则列表
exports.regExp = {
    trimAll: /\s/g,
    http: /^(https?|\/\/)/i,
};
// 公共事件名列表
var EVENT_NAMES;
(function (EVENT_NAMES) {
    EVENT_NAMES["DESTROY"] = "DESTROY";
    EVENT_NAMES["RESIZE"] = "RESIZE";
})(EVENT_NAMES = exports.EVENT_NAMES || (exports.EVENT_NAMES = {}));
// 事件名列表
var EVENT_NAMES_WAVE_LOADING;
(function (EVENT_NAMES_WAVE_LOADING) {
    EVENT_NAMES_WAVE_LOADING["PROGRESS"] = "PROGRESS";
    EVENT_NAMES_WAVE_LOADING["FINISHED"] = "FINISHED";
})(EVENT_NAMES_WAVE_LOADING = exports.EVENT_NAMES_WAVE_LOADING || (exports.EVENT_NAMES_WAVE_LOADING = {}));
