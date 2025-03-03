import React, { useState, useRef, useCallback, useMemo } from "react";
import { Copy, Check, ClipboardPaste, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RGB } from "@/types/ffi/settings";

interface ColorPickerProps {
    defaultColor: RGB;
    onChange?: (color: RGB) => void;
}

interface HSL {
    h: number;
    s: number;
    l: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const actionTimeout = 500;

export function ColorPicker({ defaultColor, onChange }: ColorPickerProps) {
    const [hsl, setHsl] = useState(() => rgbToHsl(defaultColor.r, defaultColor.g, defaultColor.b));

    const handleColorChange = useCallback(() => {
        const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l);
        const newRgb = { r, g, b };
        onChange && onChange(newRgb);
        return { newRgb, hex: rgbToHex(r, g, b) };
    }, [hsl, onChange]);

    const { newRgb: rgb, hex } = useMemo(handleColorChange, [handleColorChange]);

    const [copied, setCopied] = useState(false);
    const [pasted, setPasted] = useState<boolean | undefined>(false);
    const colorPlaneRef = useRef<HTMLDivElement>(null);

    const updateColorFromPlane = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!colorPlaneRef.current) return;

        const rect = colorPlaneRef.current.getBoundingClientRect();
        const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);

        setHsl((prev) => ({
            h: prev.h,
            s: x * 100,
            l: 100 - y * 100,
        }));
    }, []);

    const handleColorPlaneMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        let isDragging = true;
        updateColorFromPlane(e);

        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) updateColorFromPlane(e);
        };

        const handleMouseUp = () => {
            isDragging = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    }, [updateColorFromPlane]);

    const handleHueChange = useCallback((value: number[]) => {
        setHsl((prev) => ({ ...prev, h: value[0] }));
    }, []);

    const handleRgbChange = useCallback((channel: keyof RGB, value: string) => {
        const numValue = clamp(Number.parseInt(value) || 0, 0, 255);
        const newRgb = { ...rgb, [channel]: numValue };
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }, [rgb]);

    const handleHslChange = useCallback((channel: keyof HSL, value: string) => {
        const numValue = clamp(Number.parseInt(value) || 0, 0, channel === "h" ? 360 : 100);
        setHsl((prev) => ({ ...prev, [channel]: numValue }));
    }, []);

    const handleHexChange = useCallback((value: string) => {
        const color = hexToRgb(value);
        setHsl(rgbToHsl(color.r, color.g, color.b));
    }, []);

    const copyToClipboard = useCallback(async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), actionTimeout);
    }, []);

    const pasteFromClipboard = useCallback(async () => {
        const text = (await navigator.clipboard.readText()).trim().toLowerCase();
        let valid = false;

        if (text.startsWith("#")) {
            handleHexChange(text);
            valid = true;
        }

        if (valid) {
            setPasted(true);
            setTimeout(() => setPasted(false), actionTimeout);
        } else {
            setPasted(undefined);
            setTimeout(() => setPasted(false), actionTimeout);
        }
    }, [handleHexChange]);

    const cursorPosition = {
        left: `${hsl.s}%`,
        top: `${100 - hsl.l}%`,
    };

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="relative">
                <div
                    ref={colorPlaneRef}
                    className="relative w-full h-48 rounded-md cursor-crosshair"
                    style={{
                        background: `linear-gradient(to right, #fff, hsl(${hsl.h}, 100%, 50%))`,
                        backgroundImage: `
                          linear-gradient(to top, #000, transparent),
                          linear-gradient(to right, #fff, hsl(${hsl.h}, 100%, 50%))
                        `,
                    }}
                    onMouseDown={handleColorPlaneMouseDown}
                >
                    <div
                        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-md pointer-events-none"
                        style={{
                            left: cursorPosition.left,
                            top: cursorPosition.top,
                            backgroundColor: hex,
                        }}
                    />
                </div>

                <div className="mt-4 mb-6">
                    <Slider
                        value={[hsl.h]}
                        max={360}
                        step={1}
                        onValueChange={handleHueChange}
                        className="[&_.bg-primary]:bg-transparent [&_.bg-secondary]:bg-transparent"
                        style={{
                            background: `linear-gradient(to right,
                            hsl(0, 100%, 50%), hsl(60, 100%, 50%),
                            hsl(120, 100%, 50%), hsl(180, 100%, 50%),
                            hsl(240, 100%, 50%), hsl(300, 100%, 50%),
                            hsl(360, 100%, 50%))`,
                        }}
                    />
                </div>
            </div>

            <Tabs defaultValue="hex" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="hex">HEX</TabsTrigger>
                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                </TabsList>

                <TabsContent value="hex" className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Input value={hex} onChange={(e) => handleHexChange(e.target.value)} className="font-mono" />
                        <Button
                            size="icon"
                            variant={copied ? "success" : "outline"}
                            onClick={() => copyToClipboard(hex)}
                            className="shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                        <Button
                            size="icon"
                            variant={pasted === undefined ? "destructive" : pasted ? "success" : "outline"}
                            onClick={() => pasteFromClipboard()}
                            className="shrink-0"
                        >
                            {pasted === undefined ? (
                                <X className="w-4 h-4" />
                            ) : pasted ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <ClipboardPaste className="w-4 h-4" />
                            )}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="rgb" className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        {["r", "g", "b"].map((channel) => (
                            <div key={channel} className="space-y-1">
                                <Label htmlFor={`${channel}-value`} className="text-xs">
                                    {channel.toUpperCase()}
                                </Label>
                                <Input
                                    id={`${channel}-value`}
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={rgb[channel as keyof RGB]}
                                    onChange={(e) => handleRgbChange(channel as keyof RGB, e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="font-mono" />
                        <Button
                            size="icon"
                            variant={copied ? "success" : "outline"}
                            onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                            className="shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="hsl" className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                            <Label htmlFor="h-value" className="text-xs">
                                H
                            </Label>
                            <Input
                                id="h-value"
                                type="number"
                                min={0}
                                max={360}
                                value={Math.round(hsl.h)}
                                onChange={(e) => handleHslChange("h", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="s-value" className="text-xs">
                                S
                            </Label>
                            <Input
                                id="s-value"
                                type="number"
                                min={0}
                                max={100}
                                value={Math.round(hsl.s)}
                                onChange={(e) => handleHslChange("s", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="l-value" className="text-xs">
                                L
                            </Label>
                            <Input
                                id="l-value"
                                type="number"
                                min={0}
                                max={100}
                                value={Math.round(hsl.l)}
                                onChange={(e) => handleHslChange("l", e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input
                            value={`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`}
                            readOnly
                            className="font-mono"
                        />
                        <Button
                            size="icon"
                            variant={copied ? "success" : "outline"}
                            onClick={() =>
                                copyToClipboard(
                                    `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`
                                )
                            }
                            className="shrink-0"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="flex items-center space-x-2">
                <div className="w-10 h-10 rounded-md border border-border shadow-sm" style={{ backgroundColor: hex }} />
                <div className="text-sm font-medium">Current Color</div>
            </div>
        </div>
    );
}

const hexToRgb = (hex: string): RGB => {
    hex = hex.slice(1);

    const r = Number.parseInt(hex.slice(0, 2), 16);
    const g = Number.parseInt(hex.slice(2, 4), 16);
    const b = Number.parseInt(hex.slice(4, 6), 16);

    return { r, g, b };
};

const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
};

const rgbToHsl = (r: number, g: number, b: number): HSL => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

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

    return { h: Math.round(h * 360), s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): RGB => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
};
