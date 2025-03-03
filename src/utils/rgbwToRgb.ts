import { RGB, RGBW } from "@/types/ffi/settings";

export function rgbwToRgb(rgbw: RGBW): RGB {
    return {
        r: Math.min(255, rgbw.r + rgbw.w),
        g: Math.min(255, rgbw.g + rgbw.w),
        b: Math.min(255, rgbw.b + rgbw.w)
    };
}
