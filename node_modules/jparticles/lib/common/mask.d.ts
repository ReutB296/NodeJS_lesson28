import Base from "./base";
import { CommonConfig } from "../types/common-config";
export declare type modeMethodNames = 'modeNormal' | 'modeGhost';
export default abstract class Mask<Options> extends Base<Options> {
    protected maskImage?: CanvasImageSource;
    protected readonly options: Options & CommonConfig & {
        mask?: string | CanvasImageSource;
        maskMode?: 'normal' | 'ghost';
    };
    private completedMap;
    /**
     * 加载遮罩图像
     * @TODO 加载错误重试
     */
    protected loadMaskImage(): void;
    protected renderMaskMode(mainDrawing: () => void): void;
    /**
     * 常规遮罩或无遮罩模式
     */
    private modeNormal;
    /**
     * 幽灵遮罩模式：
     *   1、用遮罩图片生成灰色背景
     *   2、用波纹 clip 出原始遮罩图片
     */
    private modeGhost;
    /**
     * 绘制遮罩图案，遮罩图像填充模式为 contain 且居中
     */
    protected drawMaskImage(): void;
}
