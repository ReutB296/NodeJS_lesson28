/**
 * 类型检测
 * @param value 目标值
 * @param type 预期类型
 */
export declare function typeChecking(value: any, type: string): boolean;
/**
 * 检测 value 是否为函数
 */
export declare function isFunction(value: any): boolean;
/**
 * 检测 value 是否为纯对象，即 {} 或 new Object() 创建的对象
 * 参见 https://lodash.com/docs/4.17.15#isPlainObject
 */
export declare function isPlainObject(value: any): boolean;
/**
 * 检测 value 是否为字符串
 */
export declare function isString(value: any): boolean;
/**
 * 检测 value 是否为数值
 */
export declare function isNumber(value: any): boolean;
/**
 * 检测 value 是否为布尔值
 */
export declare function isBoolean(value: any): boolean;
/**
 * 检测 value 是否为 Undefined
 */
export declare function isUndefined(value: any): boolean;
/**
 * 检测 value 是否为 Null
 */
export declare function isNull(value: any): boolean;
/**
 * 检测 value 是否为 Undefined 或者 Null
 */
export declare function isNil(value: any): boolean;
/**
 * 检测 value 是否为 DOM 元素
 */
export declare function isElement(value: any): boolean;
