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
var Particle = /** @class */ (function (_super) {
    __extends(Particle, _super);
    function Particle(selector, options) {
        var _this = _super.call(this, Particle.defaultConfig, selector, options) || this;
        // 鼠标坐标 X
        _this.mouseX = 0;
        // 鼠标坐标 Y
        _this.mouseY = 0;
        _this.bootstrap();
        return _this;
    }
    /**
     * 初始化数据和运行程序
     */
    Particle.prototype.init = function () {
        this.ownResizeEvent();
        this.optionsNormalize();
        if (this.options.range > 0) {
            // 定位点坐标
            this.positionX = Math.random() * this.canvasWidth;
            this.positionY = Math.random() * this.canvasHeight;
            this.defineLineShape();
            this.positionEvent();
        }
        // 初始化鼠标在视差上的坐标
        this.mouseX = this.mouseY = 0;
        this.parallaxEvent();
        // 创建粒子
        this.createDots();
    };
    /**
     * 标准化配置参数，参考 calcQuantity 方法描述。
     * 如:
     *   num: 0.5  =>  表示 0.5 倍画布宽度  =>  标准化为具体数值，如 100
     *   num: 100  =>  表示具体数值  => 标准化结果还是 100
     */
    Particle.prototype.optionsNormalize = function () {
        var _a = this, canvasWidth = _a.canvasWidth, options = _a.options;
        var props = ['num', 'proximity', 'range'];
        props.forEach(function (prop) {
            options[prop] = utils_1.pInt(utils_1.calcQuantity(options[prop], canvasWidth));
        });
        // 设置触发事件的元素
        if (!utils_1.isElement(options.eventElem) && options.eventElem !== document) {
            options.eventElem = this.canvas;
        }
    };
    /**
     * 根据配置参数生成对应形状的连线函数
     */
    Particle.prototype.defineLineShape = function () {
        var _this = this;
        var _a = this.options, proximity = _a.proximity, range = _a.range, lineShape = _a.lineShape;
        switch (lineShape) {
            case 'cube':
                this.lineShapeMaker = function (x, y, sx, sy, cb) {
                    var _a = _this, positionX = _a.positionX, positionY = _a.positionY;
                    if (Math.abs(x - sx) <= proximity &&
                        Math.abs(y - sy) <= proximity &&
                        Math.abs(x - positionX) <= range &&
                        Math.abs(y - positionY) <= range &&
                        Math.abs(sx - positionX) <= range &&
                        Math.abs(sy - positionY) <= range) {
                        cb();
                    }
                };
                break;
            default:
                this.lineShapeMaker = function (x, y, sx, sy, cb) {
                    var _a = _this, positionX = _a.positionX, positionY = _a.positionY;
                    if (Math.abs(x - sx) <= proximity &&
                        Math.abs(y - sy) <= proximity &&
                        ((Math.abs(x - positionX) <= range &&
                            Math.abs(y - positionY) <= range) ||
                            (Math.abs(sx - positionX) <= range &&
                                Math.abs(sy - positionY) <= range))) {
                        cb();
                    }
                };
        }
    };
    /**
     * 根据配置参数创建许多粒子（纯数据）
     * 最后通过 draw 函数绘制真实可见的图形
     */
    Particle.prototype.createDots = function () {
        var _a = this, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, getColor = _a.getColor;
        var _b = this.options, maxR = _b.maxR, minR = _b.minR, maxSpeed = _b.maxSpeed, minSpeed = _b.minSpeed, parallaxLayer = _b.parallaxLayer;
        var layerLength = parallaxLayer.length;
        var num = this.options.num;
        while (num--) {
            var r = utils_1.randomInRange(maxR, minR);
            this.elements.push({
                r: r,
                x: utils_1.randomInRange(canvasWidth - r, r),
                y: utils_1.randomInRange(canvasHeight - r, r),
                vx: utils_1.randomSpeed(maxSpeed, minSpeed),
                vy: utils_1.randomSpeed(maxSpeed, minSpeed),
                color: getColor(),
                // 定义粒子在视差图层里的层数及每层的层级大小
                parallaxLayer: parallaxLayer[Math.floor(Math.random() * layerLength)],
                // 定义粒子视差的偏移值
                parallaxOffsetX: 0,
                parallaxOffsetY: 0,
            });
        }
    };
    /**
     * 绘制粒子
     */
    Particle.prototype.draw = function () {
        var ctx = this.ctx;
        var lineWidth = this.options.lineWidth;
        this.clearCanvasAndSetGlobalAttrs();
        // 当 canvas 宽高改变的时候，全局属性需要重新设置
        ctx.lineWidth = lineWidth;
        // 更新粒子坐标
        this.updateXY();
        // 绘制粒子
        this.elements.forEach(function (dot) {
            var x = dot.x, y = dot.y, r = dot.r, parallaxOffsetX = dot.parallaxOffsetX, parallaxOffsetY = dot.parallaxOffsetY;
            ctx.save();
            ctx.beginPath();
            ctx.arc(x + parallaxOffsetX, y + parallaxOffsetY, r, 0, constants_1.doublePi);
            ctx.fillStyle = dot.color;
            ctx.fill();
            ctx.restore();
        });
        // 连接粒子
        this.connectDots();
        // 循环绘制
        this.requestAnimationFrame();
    };
    /**
     * 连接粒子，绘制线段
     */
    Particle.prototype.connectDots = function () {
        // 当连接范围小于 0 时，不连接线段
        if (this.options.range <= 0)
            return;
        var _a = this, elements = _a.elements, ctx = _a.ctx, lineShapeMaker = _a.lineShapeMaker;
        var length = elements.length;
        elements.forEach(function (dot, i) {
            var x = dot.x + dot.parallaxOffsetX;
            var y = dot.y + dot.parallaxOffsetY;
            var _loop_1 = function () {
                var sibDot = elements[i];
                var sx = sibDot.x + sibDot.parallaxOffsetX;
                var sy = sibDot.y + sibDot.parallaxOffsetY;
                lineShapeMaker === null || lineShapeMaker === void 0 ? void 0 : lineShapeMaker(x, y, sx, sy, function () {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(sx, sy);
                    ctx.strokeStyle = dot.color;
                    ctx.stroke();
                    ctx.restore();
                });
            };
            while (++i < length) {
                _loop_1();
            }
        });
    };
    /**
     * 更新粒子坐标
     */
    Particle.prototype.updateXY = function () {
        var _a = this, isPaused = _a.isPaused, mouseX = _a.mouseX, mouseY = _a.mouseY, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        var _b = this.options, parallax = _b.parallax, parallaxStrength = _b.parallaxStrength;
        // 暂停的时候，vx 和 vy 保持不变，
        // 防止自适应窗口变化时出现粒子移动
        if (isPaused)
            return;
        this.elements.forEach(function (dot) {
            if (parallax) {
                // https://github.com/jnicol/particleground/blob/master/jquery.particleground.js#L279-L282
                var divisor = parallaxStrength * dot.parallaxLayer;
                dot.parallaxOffsetX += (mouseX / divisor - dot.parallaxOffsetX) / 10;
                dot.parallaxOffsetY += (mouseY / divisor - dot.parallaxOffsetY) / 10;
            }
            dot.x += dot.vx;
            dot.y += dot.vy;
            var r = dot.r, parallaxOffsetX = dot.parallaxOffsetX, parallaxOffsetY = dot.parallaxOffsetY;
            var x = dot.x, y = dot.y;
            x += parallaxOffsetX;
            y += parallaxOffsetY;
            // 自然碰撞反向，视差事件移动反向
            if (x + r >= canvasWidth) {
                dot.vx = -Math.abs(dot.vx);
            }
            else if (x - r <= 0) {
                dot.vx = Math.abs(dot.vx);
            }
            if (y + r >= canvasHeight) {
                dot.vy = -Math.abs(dot.vy);
            }
            else if (y - r <= 0) {
                dot.vy = Math.abs(dot.vy);
            }
        });
    };
    /**
     * 获取绑定的 DOM 元素（eventElem）的 offset 值
     */
    Particle.prototype.getEventElemOffset = function () {
        var eventElem = this.options.eventElem;
        return eventElem === document ? null : utils_1.offset(eventElem);
    };
    /**
     * 事件代理
     * @param move  移动事件处理函数
     * @param orientation  陀螺仪事件处理函数
     */
    Particle.prototype.eventProxy = function (move, orientation) {
        var _this = this;
        var eventElem = this.options.eventElem;
        var handleOrientation;
        if (constants_1.orientationSupport) {
            handleOrientation = function (e) {
                if (_this.isPaused || utils_1.isNull(e.beta))
                    return;
                // 转换 beta 范围 [-180, 180] 成 [-90, 90]
                orientation(Math.min(Math.max(e.beta, -90), 90), e.gamma);
            };
            window.addEventListener('deviceorientation', handleOrientation);
        }
        var handleMove = function (e) {
            if (_this.isPaused)
                return;
            var left = e.pageX;
            var top = e.pageY;
            var offset = _this.getEventElemOffset();
            if (offset) {
                left -= offset.left;
                top -= offset.top;
            }
            move(left, top);
        };
        eventElem.addEventListener('mousemove', handleMove);
        // 实例销毁时移除绑定的事件
        this.onDestroy(function () {
            window.removeEventListener('deviceorientation', handleOrientation);
            eventElem.removeEventListener('mousemove', handleMove);
        });
    };
    /**
     * 鼠标位置事件，根据鼠标的坐标将范围内的粒子连接起来
     */
    Particle.prototype.positionEvent = function () {
        var _this = this;
        var range = this.options.range;
        // 性能优化
        if (range > this.canvasWidth && range > this.canvasHeight)
            return;
        this.eventProxy(
        // 鼠标移动事件
        function (left, top) {
            _this.positionX = left;
            _this.positionY = top;
        }, 
        // 陀螺仪事件
        function (beta, gamma) {
            _this.positionX = (-(gamma - 90) / 180) * _this.canvasWidth;
            _this.positionY = (-(beta - 90) / 180) * _this.canvasHeight;
        });
    };
    /**
     * 视差效果事件
     */
    Particle.prototype.parallaxEvent = function () {
        var _this = this;
        if (!this.options.parallax)
            return;
        this.eventProxy(function (left, top) {
            _this.mouseX = left - _this.canvasWidth / 2;
            _this.mouseY = top - _this.canvasHeight / 2;
        }, function (beta, gamma) {
            // 一半高度或宽度的对应比例值
            // mouseX: - gamma / 90 * canvasWidth / 2;
            // mouseY: - beta / 90 * canvasHeight / 2;
            _this.mouseX = (-gamma * _this.canvasWidth) / 180;
            _this.mouseY = (-beta * _this.canvasHeight) / 180;
        });
    };
    /**
     * 窗口尺寸调整事件
     */
    Particle.prototype.ownResizeEvent = function () {
        var _this = this;
        this.onResize(function (scaleX, scaleY) {
            if (_this.options.range > 0) {
                _this.positionX *= scaleX;
                _this.positionY *= scaleY;
                _this.mouseX *= scaleX;
                _this.mouseY *= scaleY;
            }
        });
    };
    Particle.defaultConfig = {
        // 粒子个数，默认为容器宽度的 0.12 倍
        // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
        // 0 是没有意义的
        num: 0.12,
        // 粒子最大半径(0, +∞)
        maxR: 2.4,
        // 粒子最小半径(0, +∞)
        minR: 0.6,
        // 粒子最大运动速度(0, +∞)
        maxSpeed: 1,
        // 粒子最小运动速度(0, +∞)
        minSpeed: 0.1,
        // 两点连线的最大值
        // 在 range 范围内的两点距离小于 proximity，则两点之间连线
        // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
        proximity: 0.2,
        // 定位点的范围，范围越大连线越多
        // 当 range 等于 0 时，不连线，相关值无效
        // (0, 1) 显示为容器宽度相应倍数的个数，0 & [1, +∞) 显示具体个数
        range: 0.2,
        // 线段的宽度
        lineWidth: 0.2,
        // 连线的形状
        // spider: 散开的蜘蛛状
        // cube: 合拢的立方体状
        lineShape: 'spider',
        // 改变定位点坐标的事件元素
        // null 表示 canvas 画布，或传入原生元素对象，如 document 等
        eventElem: null,
        // 视差效果 {boolean}
        parallax: false,
        // 定义粒子在视差图层里的层数及每层的层级大小，类似 css 里的 z-index。
        // 取值范围: [0, +∞)，值越小视差效果越强烈，0 则不动。
        // 定义四层粒子示例：[1, 3, 5, 10]
        parallaxLayer: [1, 2, 3],
        // 视差强度，值越小视差效果越强烈
        parallaxStrength: 3,
    };
    return Particle;
}(base_1.default));
exports.default = Particle;
