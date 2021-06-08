/// <reference path="types/global.d.ts" />
import Mask from "./common/mask";
import { IElement, Options, StrNumBool } from "./types/wave";
declare const complexOptions: readonly ["fill", "fillColor", "line", "lineColor", "lineWidth", "offsetLeft", "offsetTop", "crestHeight", "speed"];
declare const plainOptions: readonly ["opacity", "mask", "maskMode"];
declare const stdProperties: readonly ["fill", "fillColor", "line", "lineColor", "lineWidth", "offsetLeft", "offsetTop", "crestHeight", "speed", "crestCount"];
export declare type ComplexOptions = ValueOf<typeof complexOptions>;
export declare type PlainOptions = ValueOf<typeof plainOptions>;
export default class Wave extends Mask<Options> {
    static defaultConfig: Options;
    protected elements: IElement[][];
    protected waveLength: number[];
    constructor(selector: string | HTMLElement, options?: Omit<Partial<Options>, 'color'>);
    /**
     * 初始化数据和运行程序
     */
    protected init(): void;
    /**
     * 标准化配置项
     */
    protected optionsNormalize(): void;
    /**
     * 配置项缺省情况下对应的默认值
     * @param property 配置项属性
     */
    protected getOptionDefaultValue(property: ValueOf<typeof stdProperties>): StrNumBool;
    /**
     * 获取配置项计算数值
     * @param property 属性
     * @param value 原始值
     * @param range 范围值
     */
    protected static getOptionProcessedValue(property: ValueOf<typeof stdProperties>, value: StrNumBool, range: number): StrNumBool;
    /**
     * 创建波浪线条像素点
     */
    protected createDots(): void;
    /**
     * 绘图
     */
    protected draw(): void;
    /**
     * 绘制波浪效果
     */
    protected drawWaves(): void;
    /**
     * 窗口尺寸调整事件
     */
    protected ownResizeEvent(): void;
    /**
     * 更新复杂选项值（合并赋值）
     * @param property 选项属性
     * @param newValue 新值
     */
    protected updateComplexOptions(property: ComplexOptions, newValue?: ValueOf<Pick<Options, ComplexOptions>>): void;
    /**
     * 更新简单选项值（直接赋值）
     * @param property 选项属性
     * @param newValue 新值
     */
    protected updatePlainOptions(option: PlainOptions, newValue?: ValueOf<Pick<Options, PlainOptions>>): void;
    /**
     * 动态设置 options 选项值
     */
    setOptions(newOptions: Partial<Pick<Options, ComplexOptions | PlainOptions>>): void;
}
export {};
