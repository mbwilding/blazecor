export interface RGB {
    r: number;
    g: number;
    b: number;
}

export interface RGBW extends RGB {
    w: number;
}

export interface HSV {
    h: number;
    s: number;
    v: number;
}

export interface HSL {
    h: number;
    s: number;
    l: number;
}
