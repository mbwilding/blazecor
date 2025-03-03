import { HSL, HSV, RGB, RGBW } from "@/types/colors";

export function rgbwToRgbDefyView(rgbw: RGBW): RGB {
    return rgbwToRgb(rgbw, 0.75);
}

export function rgbToRgbw({ r, g, b }: RGB): RGBW {
    const w = Math.min(r, g, b);
    return {
        r: r - w,
        g: g - w,
        b: b - w,
        w,
    };
}

export function rgbwToRgb({ r, g, b, w }: RGBW, whiteScalar: number = 1): RGB {
    const rNormalized = r / 255;
    const gNormalized = g / 255;
    const bNormalized = b / 255;

    const wNormalized = whiteScalar === 1 ? w / 255 : (w / 255) * whiteScalar;

    const rNew = rNormalized * (1 - wNormalized) + wNormalized;
    const gNew = gNormalized * (1 - wNormalized) + wNormalized;
    const bNew = bNormalized * (1 - wNormalized) + wNormalized;

    return {
        r: Math.round(rNew * 255),
        g: Math.round(gNew * 255),
        b: Math.round(bNew * 255),
    };
}

export function rgbwToHex({ r, g, b, w }: RGBW): string {
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}${w.toString(16).padStart(2, "0")}`;
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
    const normalizedSaturation = s / 100;
    const normalizedValue = v / 100;

    const hueSextile = Math.floor((h / 60) % 6);
    const f = h / 60 - hueSextile;
    const p = normalizedValue * (1 - normalizedSaturation);
    const q = normalizedValue * (1 - f * normalizedSaturation);
    const t = normalizedValue * (1 - (1 - f) * normalizedSaturation);

    let blue;
    let green;
    let red;

    switch (hueSextile) {
        case 0:
            red = normalizedValue;
            green = t;
            blue = p;

            break;
        case 1:
            red = q;
            green = normalizedValue;
            blue = p;

            break;
        case 2:
            red = p;
            green = normalizedValue;
            blue = t;

            break;
        case 3:
            red = p;
            green = q;
            blue = normalizedValue;

            break;
        case 4:
            red = t;
            green = p;
            blue = normalizedValue;

            break;
        default:
            red = normalizedValue;
            green = p;
            blue = q;

            break;
    }

    return {
        r: Math.min(255, Math.round(red * 256)),
        g: Math.min(255, Math.round(green * 256)),
        b: Math.min(255, Math.round(blue * 256)),
    };
}

export function rgbwToHsv({ r, g, b, w }: RGBW): HSV {
    r = r + w;
    g = g + w;
    b = b + w;

    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
        s,
        v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0;
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                h = 0;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, v: v * 100 };
}

export function rgbwToHsl({ r, g, b, w }: RGBW): HSL {
    let R = r + w;
    let G = g + w;
    let B = b + w;

    R = Math.min(255, R);
    G = Math.min(255, G);
    B = Math.min(255, B);

    R /= 255;
    G /= 255;
    B /= 255;

    const max = Math.max(R, G, B);
    const min = Math.min(R, G, B);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case R:
                h = (G - B) / d + (G < B ? 6 : 0);
                break;
            case G:
                h = (B - R) / d + 2;
                break;
            case B:
                h = (R - G) / d + 4;
                break;
        }

        h /= 6;
    }

    h *= 360;
    s *= 100;
    const lPercent = l * 100;

    return { h, s, l: lPercent };
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
        s = 0,
        l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
        g = 0,
        b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}
