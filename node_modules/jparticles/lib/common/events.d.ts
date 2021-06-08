/**
 * 事件机制，类似 NodeJS Events 模块
 * 使用文档参考 https://taro-docs.jd.com/taro/docs/apis/about/events/
 */
export default class Events {
    private listenerMap;
    /**
     * 绑定事件
     * @param eventName 事件名称
     * @param listeners 监听函数
     */
    on(eventName: string, ...listeners: Function[]): this;
    /**
     * 取消事件
     * @param eventName 事件名称
     * @param listener 监听函数
     */
    off(eventName?: string, listener?: Function): this;
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param args 参数
     */
    trigger(eventName: string, ...args: any[]): this;
}
