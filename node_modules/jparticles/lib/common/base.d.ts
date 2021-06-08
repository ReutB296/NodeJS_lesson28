import "./polyfill";
import Events from "./events";
import { CommonConfig } from "../types/common-config";
export interface GeneralElement {
    x: number;
    y: number;
}
export default abstract class Base<Options> {
    protected readonly options: Options & CommonConfig;
    protected readonly container?: HTMLElement | null;
    protected readonly canvas: HTMLCanvasElement;
    protected canvasWidth: number;
    protected canvasHeight: number;
    protected readonly ctx: CanvasRenderingContext2D;
    protected readonly getColor: () => string;
    protected elements: unknown[];
    protected isCanvasRemoved: boolean;
    protected isPaused: boolean;
    protected resizeHandler?: () => void;
    protected eventEmitter: Events;
    protected isRunningSupported: boolean;
    protected constructor(defaultConfig: Options, selector: string | HTMLElement, options?: Partial<Options>);
    /**
     * 引导程序
     */
    protected bootstrap(): void;
    /**
     * 初始化数据或方法调用
     */
    protected abstract init(): void;
    /**
     * 绘图入口
     */
    protected abstract draw(): void;
    /**
     * 清除整个画布
     */
    protected clearCanvasAndSetGlobalAttrs(): void;
    /**
     * 生成 "getColor" 函数
     */
    protected makeColorMethod(): () => string;
    /**
     * 设置画布尺寸
     */
    protected setCanvasDimension(): void;
    /**
     * 监听画布从 DOM 中被移除时，做后期清理操作，如销毁事件等
     */
    protected observeCanvasRemoved(): void;
    /**
     * 简单包装 window.requestAnimationFrame
     */
    protected requestAnimationFrame(): void;
    /**
     * 窗口尺寸调整事件
     */
    protected resizeEvent(): void;
    /**
     * 暂停运动
     */
    pause(): void;
    /**
     * 开启运动
     */
    open(): void;
    /**
     * 当 Canvas 从 DOM 中移除时触发的销毁回调事件
     * @param args 参数集合
     */
    onDestroy(...args: (() => void)[]): this;
    /**
     * 窗口尺寸改变时触发的回调事件
     * @param args 参数集合
     */
    onResize(...args: ((scaleX: number, scaleY: number) => void)[]): this;
}
