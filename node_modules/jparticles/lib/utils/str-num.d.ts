/**
 * 包装原生 parseInt，确保输出十进制数值
 */
export declare function pInt(s: string | number, radix?: number): number;
/**
 * 包装原生 toFixed，确保输出数字而不是字符串
 */
export declare function toFixed(num: number | string, digits?: number): number;
/**
 * 移除字符串内所有空白，包括空格、空行、制表符
 */
export declare function trimAll(str: string): string;
/**
 * 将字符串首字母转换成大写
 */
export declare function upperFirst(str: string): string;
