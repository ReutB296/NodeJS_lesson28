declare const easing: {
    linear(x: number, _t: number, b: number, c: number): number;
    swing(x: number, t: number, b: number, c: number, d: number): number;
    easeInOutQuad(_x: number, t: number, b: number, c: number, d: number): number;
};
export default easing;
