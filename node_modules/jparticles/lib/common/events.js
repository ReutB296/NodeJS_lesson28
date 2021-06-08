"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../utils/index");
/**
 * 事件机制，类似 NodeJS Events 模块
 * 使用文档参考 https://taro-docs.jd.com/taro/docs/apis/about/events/
 */
var Events = /** @class */ (function () {
    function Events() {
        this.listenerMap = {};
    }
    /**
     * 绑定事件
     * @param eventName 事件名称
     * @param listeners 监听函数
     */
    Events.prototype.on = function (eventName) {
        var listeners = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            listeners[_i - 1] = arguments[_i];
        }
        if (!this.listenerMap[eventName]) {
            this.listenerMap[eventName] = [];
        }
        for (var _a = 0, listeners_1 = listeners; _a < listeners_1.length; _a++) {
            var listener = listeners_1[_a];
            if (utils_1.isFunction(listener)) {
                this.listenerMap[eventName].push(listener);
            }
        }
        return this;
    };
    /**
     * 取消事件
     * @param eventName 事件名称
     * @param listener 监听函数
     */
    Events.prototype.off = function (eventName, listener) {
        if (!eventName) {
            // 移除所有事件
            this.listenerMap = {};
            return this;
        }
        if (!listener) {
            // 移除事件名称所有事件
            this.listenerMap[eventName] = [];
            return this;
        }
        // 移除事件名称特定事件
        var container = this.listenerMap[eventName];
        var index = container.indexOf(listener);
        if (index !== -1) {
            container.splice(index, 1);
        }
        return this;
    };
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param args 参数
     */
    Events.prototype.trigger = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this.listenerMap[eventName];
        if (Array.isArray(listeners)) {
            listeners.forEach(function (listener) {
                listener.apply(void 0, args);
            });
        }
        return this;
    };
    return Events;
}());
exports.default = Events;
