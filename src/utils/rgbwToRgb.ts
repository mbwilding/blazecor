import { RGB, RGBW } from "@/types/ffi/settings";

const whiteScalar = 0.75; // The white LED is about 75% as bright

export function rgbwToRgb(rgbw: RGBW): RGB {
    const r = rgbw.r / 255;
    const g = rgbw.g / 255;
    const b = rgbw.b / 255;
    const w = rgbw.w / 255 * whiteScalar;

    const rNew = r * (1 - w) + w;
    const gNew = g * (1 - w) + w;
    const bNew = b * (1 - w) + w;

    return {
        r: Math.round(rNew * 255),
        g: Math.round(gNew * 255),
        b: Math.round(bNew * 255),
    };
}
