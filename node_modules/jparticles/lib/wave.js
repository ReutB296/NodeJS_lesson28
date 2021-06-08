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
var mask_1 = __importDefault(require("./common/mask"));
var utils_1 = require("./utils/index");
// 动态更新选项：复杂类型（合并赋值）
var complexOptions = [
    'fill',
    'fillColor',
    'line',
    'lineColor',
    'lineWidth',
    'offsetLeft',
    'offsetTop',
    'crestHeight',
    'speed',
];
// 动态更新选项：简单类型（直接赋值）
var plainOptions = ['opacity', 'mask', 'maskMode'];
var stdProperties = __spreadArray(__spreadArray([], complexOptions), ['crestCount']);
var Wave = /** @class */ (function (_super) {
    __extends(Wave, _super);
    function Wave(selector, options) {
        var _this = _super.call(this, Wave.defaultConfig, selector, options) || this;
        // 波长，每个周期(2π)在 Canvas 上的实际长度
        _this.waveLength = [];
        _this.bootstrap();
        return _this;
    }
    /**
     * 初始化数据和运行程序
     */
    Wave.prototype.init = function () {
        this.ownResizeEvent();
        this.optionsNormalize();
        this.loadMaskImage();
        this.createDots();
    };
    /**
     * 标准化配置项
     */
    Wave.prototype.optionsNormalize = function () {
        var _this = this;
        stdProperties.forEach(function (property) {
            var num = _this.options.num;
            // 选项原始值
            var rawValue = _this.options[property];
            // 选项标准值
            var stdValue = [];
            // 比例范围
            var scaleRange = property === 'offsetLeft' ? _this.canvasWidth : _this.canvasHeight;
            // 将数组、字符串、数字、布尔类型等属性标准化，利于内部代码编写
            //
            // 例如 num = 3 时，
            //   crestHeight: 2或[]或[2]或[2, 2], 将标准化成: [2, 2, 2]
            //   crestHeight: 没有传值时则使用默认值，将标准化成: [x, x, x], x表示默认值
            while (num--) {
                var value = Array.isArray(rawValue) ? rawValue[num] : rawValue;
                stdValue[num] = utils_1.isUndefined(value)
                    ? _this.getOptionDefaultValue(property)
                    : Wave.getOptionProcessedValue(property, value, scaleRange);
                if (property === 'crestCount') {
                    _this.waveLength[num] = _this.canvasWidth / stdValue[num];
                }
            }
            _this.options[property] = stdValue;
        });
    };
    /**
     * 配置项缺省情况下对应的默认值
     * @param property 配置项属性
     */
    Wave.prototype.getOptionDefaultValue = function (property) {
        var _a = this, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        switch (property) {
            case 'lineColor':
            case 'fillColor':
                return utils_1.randomColor();
            case 'lineWidth':
                return utils_1.randomInRange(2, 0.2);
            case 'offsetLeft':
                return Math.random() * canvasWidth;
            case 'offsetTop':
            case 'crestHeight':
                return Math.random() * canvasHeight;
            case 'crestCount':
                return utils_1.randomInRange(canvasWidth / 2, 1);
            case 'speed':
                return utils_1.randomInRange(0.4, 0.1);
            case 'fill':
                return false;
            case 'line':
                return true;
        }
    };
    /**
     * 获取配置项计算数值
     * @param property 属性
     * @param value 原始值
     * @param range 范围值
     */
    Wave.getOptionProcessedValue = function (property, value, range) {
        if (property === 'offsetTop' ||
            property === 'offsetLeft' ||
            property === 'crestHeight') {
            return utils_1.calcQuantity(value, range);
        }
        return value;
    };
    /**
     * 创建波浪线条像素点
     */
    Wave.prototype.createDots = function () {
        var _a = this, canvasWidth = _a.canvasWidth, waveLength = _a.waveLength;
        var num = this.options.num;
        while (num--) {
            var line = [];
            // 点的 y 轴步进
            var step = constants_1.doublePi / waveLength[num];
            // 创建一条线段所需的点
            for (var i = 0; i <= canvasWidth; i++) {
                line.push({
                    x: i,
                    y: i * step,
                });
            }
            this.elements[num] = line;
        }
    };
    /**
     * 绘图
     */
    Wave.prototype.draw = function () {
        var _this = this;
        this.clearCanvasAndSetGlobalAttrs();
        this.renderMaskMode(function () {
            _this.drawWaves();
        });
        this.requestAnimationFrame();
    };
    /**
     * 绘制波浪效果
     */
    Wave.prototype.drawWaves = function () {
        var _a = this, ctx = _a.ctx, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, isPaused = _a.isPaused;
        var options = this.options;
        this.elements.forEach(function (lines, i) {
            var crestHeight = options.crestHeight[i];
            var offsetLeft = options.offsetLeft[i];
            var offsetTop = options.offsetTop[i];
            var speed = options.speed[i];
            ctx.save();
            ctx.beginPath();
            lines.forEach(function (dot, j) {
                ctx[j ? 'lineTo' : 'moveTo'](dot.x, 
                // y = A sin ( ωx + φ ) + h
                crestHeight * Math.sin(dot.y + offsetLeft) + offsetTop);
                !isPaused && (dot.y -= speed);
            });
            // 填充
            if (options.fill[i]) {
                ctx.lineTo(canvasWidth, canvasHeight);
                ctx.lineTo(0, canvasHeight);
                ctx.closePath();
                ctx.fillStyle = options.fillColor[i];
                ctx.fill();
            }
            // 绘制线条边框
            if (options.line[i]) {
                ctx.lineWidth = options.lineWidth[i];
                ctx.strokeStyle = options.lineColor[i];
                ctx.stroke();
            }
            ctx.restore();
        });
    };
    /**
     * 窗口尺寸调整事件
     */
    Wave.prototype.ownResizeEvent = function () {
        var _this = this;
        var props = ['offsetLeft', 'offsetTop', 'crestHeight'];
        var options = this.options;
        this.onResize(function (scaleX, scaleY) {
            // 调整选项缩放后的值
            props.forEach(function (prop) {
                var scale = prop === 'offsetLeft' ? scaleX : scaleY;
                options[prop].forEach(function (value, i, array) {
                    array[i] = value * scale;
                });
            });
            // 调整点的坐标
            _this.elements.forEach(function (lines) {
                lines.forEach(function (dot) {
                    dot.x *= scaleX;
                    dot.y *= scaleY;
                });
            });
        });
    };
    /**
     * 更新复杂选项值（合并赋值）
     * @param property 选项属性
     * @param newValue 新值
     */
    Wave.prototype.updateComplexOptions = function (property, newValue) {
        if (!newValue)
            return;
        var scaleRange = property === 'offsetLeft' ? this.canvasWidth : this.canvasHeight;
        var options = this.options;
        var isArrayType = Array.isArray(newValue);
        options[property].forEach(function (curValue, i, array) {
            var value = isArrayType ? newValue[i] : newValue;
            value = Wave.getOptionProcessedValue(property, value, scaleRange);
            // 未定义部分保持原有值
            if (utils_1.isUndefined(value)) {
                value = curValue;
            }
            array[i] = value;
        });
    };
    /**
     * 更新简单选项值（直接赋值）
     * @param property 选项属性
     * @param newValue 新值
     */
    Wave.prototype.updatePlainOptions = function (option, newValue) {
        this.options[option] = newValue;
        if (option === 'mask') {
            this.loadMaskImage();
        }
    };
    /**
     * 动态设置 options 选项值
     */
    Wave.prototype.setOptions = function (newOptions) {
        if (!this.isRunningSupported || !utils_1.isPlainObject(newOptions))
            return;
        for (var property in newOptions) {
            if (Object.hasOwnProperty.call(newOptions, property)) {
                if (plainOptions.indexOf(property) !== -1) {
                    this.updatePlainOptions(property, newOptions[property]);
                }
                else if (complexOptions.indexOf(property) !== -1) {
                    this.updateComplexOptions(property, newOptions[property]);
                }
            }
        }
    };
    Wave.defaultConfig = {
        // 波纹个数
        num: 3,
        // 是否填充背景色，设置为 false 相关值无效
        fill: false,
        // 填充的背景色，当 fill 设置为 true 时生效
        fillColor: [],
        // 是否绘制边框，设置为 false 相关值无效
        line: true,
        // 边框颜色，当 line 设置为 true 时生效，下同
        lineColor: [],
        // 边框宽度，空数组则随机 [.2, 2) 的宽度。
        lineWidth: [],
        // 波纹横向偏移值，距离 Canvas 左边缘的偏移值
        // (0, 1) 表示容器宽度的倍数，0 & [1, +∞) 表示具体数值
        offsetLeft: [],
        // 波纹纵向偏移值，波纹中点距离 Canvas 顶部的距离
        // (0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
        offsetTop: [],
        // 波峰高度，(0, 1) 表示容器高度的倍数，0 & [1, +∞) 表示具体数值
        crestHeight: [],
        // 波峰个数，即正弦周期个数，默认随机 [1, 0.2 * 容器宽度)
        crestCount: [],
        // 运动速度，默认随机 [.1, .4)
        speed: [],
    };
    return Wave;
}(mask_1.default));
exports.default = Wave;
