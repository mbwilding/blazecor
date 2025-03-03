import { RGB, RGBW } from "@/types/ffi/settings";

export const WHITE_SCALAR = 0.75; // The white LED is about 75% as bright

export function rgbwToRgb(rgbw: RGBW): RGB {
    const r = rgbw.r / 255;
    const g = rgbw.g / 255;
    const b = rgbw.b / 255;
    const w = (rgbw.w / 255) * WHITE_SCALAR;

    const rNew = r * (1 - w) + w;
    const gNew = g * (1 - w) + w;
    const bNew = b * (1 - w) + w;

    return {
        r: Math.round(rNew * 255),
        g: Math.round(gNew * 255),
        b: Math.round(bNew * 255),
    };
}

export function rgbwToHex(rgbw: RGBW): string {
    const result = ((rgbw.r & 0xff) << 24) | ((rgbw.g & 0xff) << 16) | ((rgbw.b & 0xff) << 8) | (rgbw.w & 0xff);
    return "#" + (result >>> 0).toString(16).padStart(8, "0");
}
