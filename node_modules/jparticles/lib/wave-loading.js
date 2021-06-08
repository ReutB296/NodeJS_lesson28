"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./common/constants");
var easing_1 = __importDefault(require("./common/easing"));
var utils_1 = require("./utils/index");
var wave_1 = __importDefault(require("./wave"));
var plainOptionsWL = [
    'font',
    'textColor',
    'textFormatter',
    'borderRadius',
];
var WaveLoading = /** @class */ (function (_super) {
    __extends(WaveLoading, _super);
    function WaveLoading(selector, options) {
        var _this = _super.call(this, selector, utils_1.merge({}, WaveLoading.defaultConfig, options)) || this;
        // 当前进度
        _this.progress = 0;
        // 是否立即完成
        _this.isCompletedImmediately = false;
        // 立即完成时的进度步进值
        _this.fastStepValue = 1;
        return _this;
    }
    /**
     * 初始化数据和运行程序
     */
    WaveLoading.prototype.init = function () {
        this.halfCH = this.canvasHeight / 2;
        // WaveLoading methods
        this.setOffsetTop(this.canvasHeight);
        this.setCanvasStyle();
        // Wave methods
        this.ownResizeEvent();
        this.optionsNormalize();
        this.loadMaskImage();
        this.createDots();
        // WaveLoading resize 事件需要放到 Wave 的后面
        this.waveLoadingResizeEvent();
    };
    /**
     * 设置 offsetTop 值
     * @param top 高度值
     */
    WaveLoading.prototype.setOffsetTop = function (top) {
        var offsetTop = this.options.offsetTop;
        if (Array.isArray(offsetTop)) {
            offsetTop.forEach(function (_item, i, arr) {
                arr[i] = top;
            });
        }
        else {
            this.options.offsetTop = top;
        }
    };
    /**
     * 设置画布 CSS 样式
     */
    WaveLoading.prototype.setCanvasStyle = function () {
        this.canvas.style.borderRadius = this.options.borderRadius;
    };
    /**
     * 绘制入口：计算进度，绘制波纹等
     */
    WaveLoading.prototype.draw = function () {
        this.calcProgress();
        if (this.progress < 100) {
            this.mainDrawing();
            this.requestAnimationFrame();
        }
        else {
            this.progress = 100;
            this.mainDrawing();
            this.eventEmitter.trigger(constants_1.EVENT_NAMES_WAVE_LOADING.FINISHED);
        }
    };
    /**
     * 绘制图案
     */
    WaveLoading.prototype.mainDrawing = function () {
        var _this = this;
        this.eventEmitter.trigger(constants_1.EVENT_NAMES_WAVE_LOADING.PROGRESS, this.progress);
        this.calcOffsetTop();
        this.clearCanvasAndSetGlobalAttrs();
        // 调用 Wave 方法
        this.renderMaskMode(function () {
            _this.drawWaves();
        });
        // 调用 WaveLoading 方法
        this.drawText();
    };
    /**
     * 绘制进度文本
     */
    WaveLoading.prototype.drawText = function () {
        var _a = this, ctx = _a.ctx, canvasWidth = _a.canvasWidth, halfCH = _a.halfCH, progress = _a.progress;
        var _b = this.options, font = _b.font, textFormatter = _b.textFormatter, textColor = _b.textColor;
        if (!utils_1.isString(textFormatter) || !textFormatter)
            return;
        // 替换文本模板真实值
        var text = textFormatter.replace(/%d/g, String(Math.floor(progress)));
        ctx.save();
        ctx.font = font;
        var textWidth = ctx.measureText(text).width;
        var x = (canvasWidth - textWidth) / 2;
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        ctx.font = font;
        ctx.fillText(text, x, halfCH);
        ctx.restore();
    };
    /**
     * 计算进度值
     */
    WaveLoading.prototype.calcProgress = function () {
        // 立即完成逻辑，采用快速步进值计算进度
        if (this.isCompletedImmediately) {
            this.progress += this.fastStepValue;
            this.fastStepValue += 0.5;
            return;
        }
        // 悬停 99% 时，跳出计算，减少性能损耗
        if (this.progress >= WaveLoading.progressThreshold)
            return;
        if (!this.startTime) {
            this.startTime = Date.now();
        }
        // x: percent complete      percent complete: elapsedTime / duration
        // t: elapsed time          elapsed time: currentTime - startTime
        // b: beginning value       start value
        // c: change in value       finish value
        // d: duration              duration
        var time = Date.now() - this.startTime;
        var percent = time / this.options.duration;
        if (percent <= 1) {
            this.progress = easing_1.default[this.options.easing](
            // x, t, b, c, d
            percent, time, 0, 100, this.options.duration);
            // 1、防止 progress 超出 100
            // 2、通过 easing 函数返回的值可能悬停 99.7，加 0.9 让进度达到阈值
            if (this.progress + 0.9 >= WaveLoading.progressThreshold) {
                this.progress = WaveLoading.progressThreshold;
            }
        }
    };
    /**
     * 根据进度计算波纹 offsetTop 值
     */
    WaveLoading.prototype.calcOffsetTop = function () {
        // 退出以提高性能
        if (!this.isCompletedImmediately &&
            this.progress >= WaveLoading.progressThreshold) {
            return;
        }
        var maxCrestHeight = Math.max.apply(Math, this.options.crestHeight);
        var top = this.progress === 100
            ? -maxCrestHeight
            : Math.ceil(((100 - this.progress) / 100) * this.canvasHeight + maxCrestHeight);
        this.setOffsetTop(top);
    };
    /**
     * 窗口尺寸调整事件
     */
    WaveLoading.prototype.waveLoadingResizeEvent = function () {
        var _this = this;
        this.onResize(function () {
            _this.halfCH = _this.canvasHeight / 2;
            if (_this.progress === 100) {
                _this.draw();
            }
        });
    };
    /**
     * 方法：动态设置属性值
     */
    WaveLoading.prototype.setOptions = function (newOptions) {
        if (!this.isRunningSupported || !utils_1.isPlainObject(newOptions))
            return;
        // 调用 Wave 更新项
        _super.prototype.setOptions.call(this, newOptions);
        for (var property in newOptions) {
            if (Object.hasOwnProperty.call(newOptions, property) &&
                plainOptionsWL.indexOf(property) !== -1) {
                var newValue = newOptions[property];
                this.options[property] = newValue;
                if (property === 'borderRadius') {
                    this.setCanvasStyle();
                }
            }
        }
    };
    /**
     * 方法：让进度立即加载完成
     */
    WaveLoading.prototype.done = function () {
        if (this.isRunningSupported && !this.isCompletedImmediately) {
            this.isCompletedImmediately = true;
        }
    };
    /**
     * 事件：进度每次改变的时候触发
     */
    WaveLoading.prototype.onProgress = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.eventEmitter).on.apply(_a, __spreadArray([constants_1.EVENT_NAMES_WAVE_LOADING.PROGRESS], args));
        return this;
    };
    /**
     * 事件：进度加载到 100% 后触发
     */
    WaveLoading.prototype.onFinished = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        (_a = this.eventEmitter).on.apply(_a, __spreadArray([constants_1.EVENT_NAMES_WAVE_LOADING.FINISHED], args));
        return this;
    };
    WaveLoading.defaultConfig = {
        num: 1,
        // [font style][font weight][font size][font family]
        // 文本样式，同css一样，必须包含 [font size] 和 [font family]
        font: 'normal 400 16px Arial',
        // 文本颜色
        textColor: '#333',
        // 进度文本模板
        textFormatter: 'loading...%d%',
        fill: true,
        line: false,
        // 填充的背景色
        fillColor: '#27C9E5',
        // 画布外边框圆角
        borderRadius: '50%',
        // 线条横向偏移值，距离canvas画布左边的偏移值
        // (0, 1)表示容器宽度的倍数，0 & [1, +∞)表示具体数值
        offsetLeft: 0,
        // 波峰高度，(0, 1)表示容器高度的倍数，0 & [1, +∞)表示具体数值
        crestHeight: 4,
        // 波纹个数，即正弦周期个数
        crestCount: 1,
        // 波浪的运动速度
        speed: 0.3,
        // 加载到 99% 的时长，单位毫秒(ms)
        // 用时越久，越慢加载到 99%。
        duration: 5000,
        // 加载过程的运动效果，
        // 目前支持匀速(linear)，先加速再减速(swing)，两种
        easing: 'swing',
    };
    // 进度阈值
    WaveLoading.progressThreshold = 99.99;
    return WaveLoading;
}(wave_1.default));
exports.default = WaveLoading;
