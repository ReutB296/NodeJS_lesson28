"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var easing = {
    linear: function (x, _t, b, c) {
        return b + (c - b) * x;
    },
    swing: function (x, t, b, c, d) {
        return easing.easeInOutQuad(x, t, b, c, d);
    },
    easeInOutQuad: function (_x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return (c / 2) * t * t + b;
        return (-c / 2) * (--t * (t - 2) - 1) + b;
    },
};
exports.default = easing;
