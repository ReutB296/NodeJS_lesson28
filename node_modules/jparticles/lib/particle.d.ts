/// <reference path="types/global.d.ts" />
import Base from "./common/base";
import { IElement, Options } from "./types/particle";
export default class Particle extends Base<Options> {
    static defaultConfig: Options;
    protected elements: IElement[];
    private positionX?;
    private positionY?;
    private mouseX;
    private mouseY;
    private lineShapeMaker?;
    constructor(selector: string | HTMLElement, options?: Partial<Options>);
    /**
     * 初始化数据和运行程序
     */
    protected init(): void;
    /**
     * 标准化配置参数，参考 calcQuantity 方法描述。
     * 如:
     *   num: 0.5  =>  表示 0.5 倍画布宽度  =>  标准化为具体数值，如 100
     *   num: 100  =>  表示具体数值  => 标准化结果还是 100
     */
    private optionsNormalize;
    /**
     * 根据配置参数生成对应形状的连线函数
     */
    private defineLineShape;
    /**
     * 根据配置参数创建许多粒子（纯数据）
     * 最后通过 draw 函数绘制真实可见的图形
     */
    private createDots;
    /**
     * 绘制粒子
     */
    protected draw(): void;
    /**
     * 连接粒子，绘制线段
     */
    private connectDots;
    /**
     * 更新粒子坐标
     */
    private updateXY;
    /**
     * 获取绑定的 DOM 元素（eventElem）的 offset 值
     */
    private getEventElemOffset;
    /**
     * 事件代理
     * @param move  移动事件处理函数
     * @param orientation  陀螺仪事件处理函数
     */
    private eventProxy;
    /**
     * 鼠标位置事件，根据鼠标的坐标将范围内的粒子连接起来
     */
    private positionEvent;
    /**
     * 视差效果事件
     */
    private parallaxEvent;
    /**
     * 窗口尺寸调整事件
     */
    private ownResizeEvent;
}
