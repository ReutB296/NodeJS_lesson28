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
var constants_1 = require("./common/constants");
var utils_1 = require("./utils/index");
var Snow = /** @class */ (function (_super) {
    __extends(Snow, _super);
    function Snow(selector, options) {
        var _this = _super.call(this, Snow.defaultConfig, selector, options) || this;
        _this.bootstrap();
        return _this;
    }
    /**
     * 初始化数据和运行程序
     */
    Snow.prototype.init = function () {
        this.createSnowflakes();
    };
    /**
     * 创建单个雪花，包含大小、位置、速度等信息
     */
    Snow.prototype.createSnowflake = function () {
        var _a = this.options, maxR = _a.maxR, minR = _a.minR, maxSpeed = _a.maxSpeed, minSpeed = _a.minSpeed;
        var r = utils_1.randomInRange(maxR, minR);
        return {
            r: r,
            x: Math.random() * this.canvasWidth,
            y: -r,
            vx: utils_1.randomSpeed(maxSpeed, minSpeed),
            // 半径越大，垂直速度越快，这样比较有近快远慢的层次效果
            vy: Math.abs(r * utils_1.randomSpeed(maxSpeed, minSpeed)),
            color: this.getColor(),
            swingAt: Date.now(),
        };
    };
    /**
     * 随机创建雪花
     */
    Snow.prototype.createSnowflakes = function () {
        var count = Math.max(0, utils_1.pInt(Math.random() * this.options.num));
        while (count--) {
            this.elements.push(this.createSnowflake());
        }
    };
    /**
     * 绘图
     */
    Snow.prototype.draw = function () {
        var _this = this;
        var _a = this, ctx = _a.ctx, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, isPaused = _a.isPaused;
        var _b = this.options, maxR = _b.maxR, swing = _b.swing, swingInterval = _b.swingInterval, swingProbability = _b.swingProbability;
        this.clearCanvasAndSetGlobalAttrs();
        this.elements.forEach(function (snowflake, i, array) {
            var x = snowflake.x, y = snowflake.y, r = snowflake.r;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, r, 0, constants_1.doublePi);
            ctx.fillStyle = snowflake.color;
            ctx.fill();
            ctx.restore();
            if (!isPaused) {
                snowflake.x += snowflake.vx;
                snowflake.y += snowflake.vy;
                // 变换飘落方向，根据一定的几率
                if (swing &&
                    Date.now() - snowflake.swingAt > swingInterval &&
                    // 半径越小，变换几率越小
                    Math.random() < (r / maxR) * swingProbability) {
                    snowflake.swingAt = Date.now();
                    snowflake.vx *= -1;
                }
                if (x < 0 || x - r > canvasWidth) {
                    // 雪花从侧边出去，删除再添加一个
                    array.splice(i, 1, _this.createSnowflake());
                }
                else if (y - r > canvasHeight) {
                    // 雪花从底部出去，删除
                    array.splice(i, 1);
                }
            }
        });
        // 添加雪花
        if (!isPaused && Math.random() > 0.9) {
            this.createSnowflakes();
        }
        this.requestAnimationFrame();
    };
    Snow.defaultConfig = {
        num: 6,
        color: '#fff',
        maxR: 6.5,
        minR: 0.5,
        maxSpeed: 0.6,
        minSpeed: 0.1,
        swing: true,
        swingInterval: 2000,
        swingProbability: 0.06,
    };
    return Snow;
}(base_1.default));
exports.default = Snow;
