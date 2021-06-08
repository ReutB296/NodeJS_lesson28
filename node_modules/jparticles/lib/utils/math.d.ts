/**
 * 角度转弧度
 */
export declare function degreesToRadians(degrees: number): number;
/**
 * 弧度转角度
 */
export declare function radiansToDegrees(radians: number): number;
/**
 * 根据「原始值」及「范围值」计算数量
 * 当原始值为 (0, 1) 时，返回原始值与范围值的倍数
 * 当原始值为 0 或 [1, +∞) 时，返回原始值
 * @param value  原始值
 * @param range  范围值
 */
export declare function calcQuantity(value: number, range: number): number;
