
import React, { useState, useCallback, useMemo } from "react";
import { Copy, Check, ClipboardPaste } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RGB, RGBW } from "@/types/ffi/settings";

interface ColorPickerProps {
    defaultColor: RGB | RGBW;
    onChange?: (color: RGB | RGBW) => void;
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

    const { hex } = useMemo(handleColorChange, [handleColorChange]);

    const [copied, setCopied] = useState(false);

    const handleHueChange = useCallback((value: number[]) => {
        setHsl((prev) => ({ ...prev, h: value[0] }));
    }, []);

    const handleHslChange = useCallback((channel: keyof HSL, value: string) => {
        const numValue = clamp(Number.parseInt(value) || 0, 0, channel === "h" ? 360 : 100);
        setHsl((prev) => ({ ...prev, [channel]: numValue }));
    }, []);

    const copyToClipboard = useCallback(async (text: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), actionTimeout);
    }, []);

    return (
        <div className="w-full max-w-sm space-y-4">
            <div className="relative">
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

            <Tabs defaultValue="hsl" className="w-full">
                <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="hex" disabled>HEX</TabsTrigger>
                    <TabsTrigger value="rgb" disabled>RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                </TabsList>

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
