/// <reference path="types/global.d.ts" />
import { CommonConfig } from "./types/common-config";
import { InputOptions, Options } from "./types/wave-loading";
import Wave, { ComplexOptions, PlainOptions } from "./wave";
declare const plainOptionsWL: readonly ["font", "textColor", "textFormatter", "borderRadius"];
export declare type PlainOptionsWL = ValueOf<typeof plainOptionsWL>;
export default class WaveLoading extends Wave {
    static defaultConfig: Options;
    static progressThreshold: number;
    protected readonly options: Options & CommonConfig;
    private progress;
    private halfCH;
    private isCompletedImmediately;
    private fastStepValue;
    private startTime?;
    constructor(selector: string | HTMLElement, options?: Partial<InputOptions>);
    /**
     * 初始化数据和运行程序
     */
    protected init(): void;
    /**
     * 设置 offsetTop 值
     * @param top 高度值
     */
    private setOffsetTop;
    /**
     * 设置画布 CSS 样式
     */
    private setCanvasStyle;
    /**
     * 绘制入口：计算进度，绘制波纹等
     */
    protected draw(): void;
    /**
     * 绘制图案
     */
    private mainDrawing;
    /**
     * 绘制进度文本
     */
    private drawText;
    /**
     * 计算进度值
     */
    private calcProgress;
    /**
     * 根据进度计算波纹 offsetTop 值
     */
    private calcOffsetTop;
    /**
     * 窗口尺寸调整事件
     */
    protected waveLoadingResizeEvent(): void;
    /**
     * 方法：动态设置属性值
     */
    setOptions(newOptions: Partial<Pick<Options, ComplexOptions | PlainOptions | PlainOptionsWL>>): void;
    /**
     * 方法：让进度立即加载完成
     */
    done(): void;
    /**
     * 事件：进度每次改变的时候触发
     */
    onProgress(...args: Array<(progress: number) => void>): this;
    /**
     * 事件：进度加载到 100% 后触发
     */
    onFinished(...args: Array<() => void>): this;
}
export {};
