/// <reference path="types/global.d.ts" />
import commonConfig from "./common/config";
import easing from "./common/easing";
import Events from "./common/events";
import * as utils from "./utils/index";
import Line from "./line";
import Particle from "./particle";
import Snow from "./snow";
import Wave from "./wave";
import WaveLoading from "./wave-loading";
export { Line, Particle, Snow, Wave, WaveLoading, commonConfig, easing, Events, utils, };
declare const _default: {
    Line: typeof Line;
    Particle: typeof Particle;
    Snow: typeof Snow;
    Wave: typeof Wave;
    WaveLoading: typeof WaveLoading;
    commonConfig: {
        opacity: number;
        color: never[];
        resize: boolean;
    };
    easing: {
        linear(x: number, _t: number, b: number, c: number): number;
        swing(x: number, t: number, b: number, c: number, d: number): number;
        easeInOutQuad(_x: number, t: number, b: number, c: number, d: number): number;
    };
    Events: typeof Events;
    utils: typeof utils;
};
export default _default;
