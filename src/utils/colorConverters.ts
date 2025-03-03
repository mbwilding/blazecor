import { HSV, RGB, RGBW } from "@/types/colors";

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
