"use strict";
// requestAnimationFrame
window.requestAnimationFrame = (function (win) {
    return (win.requestAnimationFrame ||
        win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame ||
        function (fn) {
            return win.setTimeout(fn, 1000 / 60);
        });
})(window);
// Math.hypot
if (!Math.hypot) {
    Math.hypot = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var max = 0;
        var s = 0;
        var containsInfinity = false;
        for (var i = 0; i < arguments.length; ++i) {
            var arg = Math.abs(Number(args[i]));
            if (arg === Infinity)
                containsInfinity = true;
            if (arg > max) {
                s *= (max / arg) * (max / arg);
                max = arg;
            }
            s += arg === 0 && max === 0 ? 0 : (arg / max) * (arg / max);
        }
        return containsInfinity
            ? Infinity
            : max === 1 / 0
                ? 1 / 0
                : max * Math.sqrt(s);
    };
}
