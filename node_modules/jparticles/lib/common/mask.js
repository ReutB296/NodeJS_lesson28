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
var base_1 = __importDefault(require("./base"));
var utils_1 = require("../utils/index");
var Mask = /** @class */ (function (_super) {
    __extends(Mask, _super);
    function Mask() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // 已经加载成功的图像列表
        _this.completedMap = {};
        return _this;
    }
    /**
     * 加载遮罩图像
     * @TODO 加载错误重试
     */
    Mask.prototype.loadMaskImage = function () {
        var _this = this;
        var mask = this.options.mask;
        if (!mask)
            return;
        if (utils_1.isString(mask)) {
            // 取缓存图像
            if (this.completedMap[mask]) {
                this.maskImage = this.completedMap[mask];
                return;
            }
            utils_1.loadImage(mask, function (image) {
                _this.completedMap[mask] = image;
                _this.maskImage = image;
            });
        }
        else {
            this.maskImage = mask;
        }
    };
    Mask.prototype.renderMaskMode = function (mainDrawing) {
        if (!this.maskImage) {
            mainDrawing();
            return;
        }
        var modeName = this.options.maskMode || 'normal';
        this.ctx.save();
        this["mode" + utils_1.upperFirst(modeName)](mainDrawing);
        this.ctx.restore();
    };
    /**
     * 常规遮罩或无遮罩模式
     */
    Mask.prototype.modeNormal = function (mainDrawing) {
        this.drawMaskImage();
        // 设置图形组合模式，将效果映射到遮罩内
        this.ctx.globalCompositeOperation = 'source-atop';
        mainDrawing();
    };
    /**
     * 幽灵遮罩模式：
     *   1、用遮罩图片生成灰色背景
     *   2、用波纹 clip 出原始遮罩图片
     */
    Mask.prototype.modeGhost = function (mainDrawing) {
        // 绘制灰色背景
        this.ctx.save();
        this.ctx.filter = 'grayscale(100%)';
        this.drawMaskImage();
        this.ctx.restore();
        // 设置图形组合模式，将效果映射到遮罩内
        this.ctx.globalCompositeOperation = 'source-atop';
        // 绘制原始图案
        mainDrawing();
        this.ctx.clip();
        this.drawMaskImage();
    };
    /**
     * 绘制遮罩图案，遮罩图像填充模式为 contain 且居中
     */
    Mask.prototype.drawMaskImage = function () {
        if (!this.maskImage)
            return;
        var _a = this, ctx = _a.ctx, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, maskImage = _a.maskImage;
        var originWidth = maskImage.width;
        var originHeight = maskImage.height;
        var imgScale = originWidth / originHeight;
        // 图像填充算法: contain 模式
        var width = originWidth > canvasWidth ? canvasWidth : originWidth;
        var height = originHeight > canvasHeight ? canvasHeight : originHeight;
        if (originWidth > originHeight) {
            height = width / imgScale;
        }
        else {
            width = height * imgScale;
        }
        // 居中处理
        var x = (canvasWidth - width) / 2;
        var y = (canvasHeight - height) / 2;
        ctx.drawImage(maskImage, 0, 0, originWidth, originHeight, x, y, width, height);
    };
    return Mask;
}(base_1.default));
exports.default = Mask;
