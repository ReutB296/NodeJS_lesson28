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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var base_1 = __importDefault(require("./common/base"));
var utils_1 = require("./utils/index");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(selector, options) {
        var _this = _super.call(this, Line.defaultConfig, selector, options) || this;
        // 特殊角度
        _this.specificAngles = [-180, -90, 0, 90, 180];
        _this.bootstrap();
        return _this;
    }
    /**
     * 初始化数据和运行程序
     */
    Line.prototype.init = function () {
        this.createLines(this.options.num);
        this.createLinesOnClick();
    };
    /**
     * 创建设定数量的线条
     * @param number 数量
     * @param positionX 线条的 x 坐标，没有则随机
     */
    Line.prototype.createLines = function (number, positionX) {
        var _a = this.options, maxWidth = _a.maxWidth, minWidth = _a.minWidth, maxSpeed = _a.maxSpeed, minSpeed = _a.minSpeed, maxDegree = _a.maxDegree, minDegree = _a.minDegree;
        while (number--) {
            this.elements.push({
                x: positionX !== null && positionX !== void 0 ? positionX : Math.random() * this.canvasWidth,
                width: utils_1.randomInRange(maxWidth, minWidth),
                color: this.getColor(),
                speed: utils_1.randomSpeed(maxSpeed, minSpeed),
                // 限制角度取值范围为 [-180, 180]
                degree: utils_1.toFixed(utils_1.randomInRange(maxDegree, minDegree) % 180),
            });
        }
    };
    /**
     * 点击的时候创建线条
     */
    Line.prototype.createLinesOnClick = function () {
        var _this = this;
        if (!this.options.createOnClick)
            return;
        var handleClick = function (event) {
            if (_this.isPaused)
                return;
            var x = event.pageX - utils_1.offset(_this.canvas).left;
            _this.createLines(_this.options.numberOfCreations, x);
        };
        this.canvas.addEventListener('click', handleClick);
        this.onDestroy(function () {
            _this.canvas.removeEventListener('click', handleClick);
        });
    };
    Line.prototype.draw = function () {
        var _this = this;
        var _a = this, ctx = _a.ctx, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        var _b = this.options, removeOnOverflow = _b.removeOnOverflow, overflowCompensation = _b.overflowCompensation, reservedLines = _b.reservedLines;
        this.clearCanvasAndSetGlobalAttrs();
        // 以 Canvas 三角形计算出来的最长边的 10 倍长度作为线段的半长
        var hypotenuse = Math.hypot(canvasWidth, canvasHeight);
        var lineLength = hypotenuse * 10;
        // 溢出补偿
        var OC = Math.max(0, overflowCompensation);
        this.elements.forEach(function (line, i) {
            // 逆时针表示，3 点钟方向表示 0 度，12 点钟方向表示 90 度（即垂直），9 点钟方向表示 180 度。
            var radian = utils_1.degreesToRadians(-line.degree);
            // 可视区内角度邻边的长度
            var adjacentSide = 0;
            if (!_this.specificAngles.includes(line.degree)) {
                adjacentSide = Math.abs(_this.canvasHeight / 2 / Math.tan(radian));
            }
            ctx.save();
            ctx.beginPath();
            // 通过 translate 将线段移动到指定位置
            ctx.translate(line.x, _this.canvasHeight / 2);
            ctx.rotate(radian);
            // 在 (0, 0) 位置横向描绘线段
            ctx.moveTo(-lineLength, 0);
            ctx.lineTo(lineLength, 0);
            // 设置线条宽度和颜色
            ctx.lineWidth = line.width;
            ctx.strokeStyle = line.color;
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
            if (!_this.isPaused) {
                line.x += line.speed;
            }
            var isOverflow = false;
            var isOverflowOnLeft = false;
            // 溢出补偿，让溢出多偏移一点才反向
            if (line.x + adjacentSide + line.width + OC < 0) {
                isOverflow = true;
                isOverflowOnLeft = true;
            }
            else if (line.x > _this.canvasWidth + adjacentSide + line.width + OC) {
                isOverflow = true;
            }
            if (isOverflow) {
                if (removeOnOverflow && _this.elements.length > reservedLines) {
                    // 溢出移除
                    _this.elements.splice(i, 1);
                }
                else {
                    // 溢出反向
                    line.speed = Math.abs(line.speed) * (isOverflowOnLeft ? 1 : -1);
                }
            }
        });
        this.requestAnimationFrame();
    };
    Line.defaultConfig = {
        num: 6,
        maxWidth: 2,
        minWidth: 1,
        maxSpeed: 3,
        minSpeed: 1,
        maxDegree: 90,
        minDegree: 80,
        createOnClick: true,
        numberOfCreations: 3,
        removeOnOverflow: true,
        overflowCompensation: 20,
        reservedLines: 6,
    };
    return Line;
}(base_1.default));
exports.default = Line;
