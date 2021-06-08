/**
 * 获取 DOM 元素数值类型的样式并返回取整后的数值
 * @param elem  DOM 元素
 * @param attr  CSS 属性
 */
export declare function getNumberValueOfStyle(elem: HTMLElement, attr: keyof CSSStyleDeclaration): number | void;
/**
 * 获取 DOM 元素距离页面的 top、left 值
 * @param elem  DOM 元素
 */
export declare function offset(elem: HTMLElement): {
    left: number;
    top: number;
};
/**
 * 不管是 MutationObserver 还是 DOMNodeRemoved，
 * 当监听某个具体的元素时，如果祖先节点被删除了，并不会触发该元素被移除的事件，
 * 所以要监听整个文档，每次移除事件都得递归遍历要监听的元素是否被删除。
 */
export declare const observeElementRemoved: (element: HTMLElement, callback: () => void) => void;
