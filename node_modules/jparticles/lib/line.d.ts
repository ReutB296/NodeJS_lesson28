/// <reference path="types/global.d.ts" />
import Base from "./common/base";
import { IElement, Options } from "./types/line";
export default class Line extends Base<Options> {
    static defaultConfig: Options;
    protected elements: IElement[];
    private specificAngles;
    constructor(selector: string | HTMLElement, options?: Partial<Options>);
    /**
     * 初始化数据和运行程序
     */
    protected init(): void;
    /**
     * 创建设定数量的线条
     * @param number 数量
     * @param positionX 线条的 x 坐标，没有则随机
     */
    private createLines;
    /**
     * 点击的时候创建线条
     */
    private createLinesOnClick;
    protected draw(): void;
}
