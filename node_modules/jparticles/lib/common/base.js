"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./polyfill");
var config_1 = __importDefault(require("./config"));
var constants_1 = require("./constants");
var events_1 = __importDefault(require("./events"));
var utils_1 = require("../utils/index");
var Base = /** @class */ (function () {
    function Base(defaultConfig, selector, options) {
        // （粒子）数据集
        this.elements = [];
        // Canvas 是否从 DOM 中移除了
        this.isCanvasRemoved = false;
        // 是否暂停运动了
        this.isPaused = false;
        // 事件中心，文档参考 https://taro-docs.jd.com/taro/docs/apis/about/events/
        this.eventEmitter = new events_1.default();
        // 特效是否支持运行
        this.isRunningSupported = false;
        // 对于不支持运行特效的浏览器（如 IE8）将不支持创建特效
        if (!constants_1.isRuntimeSupported)
            return;
        this.container = utils_1.isElement(selector)
            ? selector
            : document.querySelector(selector);
        this.isRunningSupported = !!this.container;
        if (this.container) {
            this.options = utils_1.merge({}, config_1.default, defaultConfig, options);
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            this.container.innerHTML = '';
            this.container.appendChild(this.canvas);
            // 缓存颜色获取函数，提高性能
            this.getColor = this.makeColorMethod();
        }
    }
    /**
     * 引导程序
     */
    Base.prototype.bootstrap = function () {
        if (this.isRunningSupported) {
            this.setCanvasDimension();
            this.observeCanvasRemoved();
            this.resizeEvent();
            this.init();
            this.draw();
        }
    };
    /**
     * 清除整个画布
     */
    Base.prototype.clearCanvasAndSetGlobalAttrs = function () {
        var _a = this, ctx = _a.ctx, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.globalAlpha = this.options.opacity;
    };
    /**
     * 生成 "getColor" 函数
     */
    Base.prototype.makeColorMethod = function () {
        var color = this.options.color;
        var colorLength = Array.isArray(color) ? color.length : 0;
        if (utils_1.isString(color)) {
            return function () { return color; };
        }
        if (colorLength === 0) {
            return utils_1.randomColor;
        }
        return function () { return color[Math.floor(Math.random() * colorLength)]; };
    };
    /**
     * 设置画布尺寸
     */
    Base.prototype.setCanvasDimension = function () {
        var dpr = window.devicePixelRatio;
        var width = utils_1.getNumberValueOfStyle(this.container, 'width') || constants_1.defaultCanvasWidth;
        var height = utils_1.getNumberValueOfStyle(this.container, 'height') || constants_1.defaultCanvasHeight;
        this.canvasWidth = width;
        this.canvasHeight = height;
        // 设置设备分辨率，防止在高清屏显示模糊（Mac OS）
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.ctx.scale(dpr, dpr);
    };
    /**
     * 监听画布从 DOM 中被移除时，做后期清理操作，如销毁事件等
     */
    Base.prototype.observeCanvasRemoved = function () {
        var _this = this;
        utils_1.observeElementRemoved(this.canvas, function () {
            // 当 Canvas 从 DOM 中被移除
            // 1、停止 requestAnimationFrame，避免性能损耗
            _this.isCanvasRemoved = true;
            // 2、移除绑定事件
            if (_this.resizeHandler) {
                window.removeEventListener('resize', _this.resizeHandler);
            }
            // 3、触发销毁回调事件
            _this.eventEmitter.trigger(constants_1.EVENT_NAMES.DESTROY);
            // 4、移除所有事件
            _this.eventEmitter.off();
        });
    };
    /**
     * 简单包装 window.requestAnimationFrame
     */
    Base.prototype.requestAnimationFrame = function () {
        if (!this.isPaused && !this.isCanvasRemoved) {
            window.requestAnimationFrame(this.draw.bind(this));
        }
    };
    /**
     * 窗口尺寸调整事件
     */
    Base.prototype.resizeEvent = function () {
        var _this = this;
        if (this.options.resize) {
            // 窗口尺寸改变处理函数，对应调整（粒子）位置
            this.resizeHandler = function () {
                var preCW = _this.canvasWidth;
                var preCH = _this.canvasHeight;
                // 重设画布尺寸
                _this.setCanvasDimension();
                // 缩放比例
                var scaleX = _this.canvasWidth / preCW;
                var scaleY = _this.canvasHeight / preCH;
                // 通用处理逻辑，重新计算粒子坐标
                _this.elements.forEach(function (element) {
                    if (utils_1.isPlainObject(element)) {
                        ;
                        element.x *= scaleX;
                        element.y *= scaleY;
                    }
                });
                // 触发窗口缩放事件，可自定义更多逻辑
                _this.eventEmitter.trigger(constants_1.EVENT_NAMES.RESIZE, scaleX, scaleY);
                _this.isPaused && _this.draw();
            };
            window.addEventListener('resize', this.resizeHandler);
        }
    };
    /**
     * 暂停运动
     */
    Base.prototype.pause = function () {
        if (this.isRunningSupported && !this.isCanvasRemoved && !this.isPaused) {
            this.isPaused = true;
        }
    };
    /**
     * 开启运动
     */
    Base.prototype.open = function () {
        if (this.isRunningSupported && !this.isCanvasRemoved && this.isPaused) {
            this.isPaused = false;
            this.draw();
        }
    };
    /**
     * 当 Canvas 从 DOM 中移除时触发的销毁回调事件
     * @param args 参数集合
     */
    Base.prototype.onDestroy = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.eventEmitter).on.apply(_a, __spreadArray([constants_1.EVENT_NAMES.DESTROY], args));
        // 让事件支持链式操作
        return this;
    };
    /**
     * 窗口尺寸改变时触发的回调事件
     * @param args 参数集合
     */
    Base.prototype.onResize = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.eventEmitter).on.apply(_a, __spreadArray([constants_1.EVENT_NAMES.RESIZE], args));
        // 让事件支持链式操作
        return this;
    };
    return Base;
}());
exports.default = Base;
