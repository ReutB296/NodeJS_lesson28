/// <reference path="types/global.d.ts" />
import Base from "./common/base";
import { IElement, Options } from "./types/snow";
export default class Snow extends Base<Options> {
    static defaultConfig: Options;
    protected elements: IElement[];
    constructor(selector: string | HTMLElement, options?: Partial<Options>);
    /**
     * 初始化数据和运行程序
     */
    protected init(): void;
    /**
     * 创建单个雪花，包含大小、位置、速度等信息
     */
    private createSnowflake;
    /**
     * 随机创建雪花
     */
    private createSnowflakes;
    /**
     * 绘图
     */
    protected draw(): void;
}
