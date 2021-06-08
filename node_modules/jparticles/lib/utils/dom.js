"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.observeElementRemoved = exports.offset = exports.getNumberValueOfStyle = void 0;
var checking_1 = require("./checking");
var str_num_1 = require("./str-num");
/**
 * 获取 DOM 元素数值类型的样式并返回取整后的数值
 * @param elem  DOM 元素
 * @param attr  CSS 属性
 */
function getNumberValueOfStyle(elem, attr) {
    var value = window.getComputedStyle(elem)[attr];
    if (checking_1.isString(value)) {
        // 匹配字符串的数字字符
        var numberValue = value.match(/\d+/);
        if (numberValue) {
            return str_num_1.pInt(numberValue[0]);
        }
    }
}
exports.getNumberValueOfStyle = getNumberValueOfStyle;
/**
 * 获取 DOM 元素距离页面的 top、left 值
 * @param elem  DOM 元素
 */
function offset(elem) {
    var bounding = elem.getBoundingClientRect();
    return {
        left: window.pageXOffset + bounding.left,
        top: window.pageYOffset + bounding.top,
    };
}
exports.offset = offset;
/**
 * 不管是 MutationObserver 还是 DOMNodeRemoved，
 * 当监听某个具体的元素时，如果祖先节点被删除了，并不会触发该元素被移除的事件，
 * 所以要监听整个文档，每次移除事件都得递归遍历要监听的元素是否被删除。
 */
exports.observeElementRemoved = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var checkElementRemoved = function (node, element) {
        if (node === element) {
            return true;
        }
        if (checking_1.isElement(node)) {
            var children = node.children;
            var length_1 = children.length;
            while (length_1--) {
                if (checkElementRemoved(children[length_1], element)) {
                    return true;
                }
            }
        }
        return false;
    };
    var useMutation = function (element, callback) {
        var observer = new MutationObserver(function (mutations, observer) {
            var i = mutations.length;
            while (i--) {
                var removeNodes = mutations[i].removedNodes;
                var j = removeNodes.length;
                while (j--) {
                    if (checkElementRemoved(removeNodes[j], element)) {
                        observer.disconnect();
                        return callback();
                    }
                }
            }
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    };
    var useDOMNodeRemoved = function (element, callback) {
        var DOMNodeRemoved = function (e) {
            if (checkElementRemoved(e.target, element)) {
                document.removeEventListener('DOMNodeRemoved', DOMNodeRemoved);
                callback();
            }
        };
        document.addEventListener('DOMNodeRemoved', DOMNodeRemoved);
    };
    return MutationObserver ? useMutation : useDOMNodeRemoved;
})();
