import React, { useState, useEffect, useRef, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Color } from "@/types/ffi/settings";

interface ColorPickerProps {
    defaultColor: Color;
    onChange?: (color: Color) => void;
}

interface HSL {
    h: number;
    s: number;
    l: number;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function ColorPicker({ defaultColor, onChange }: ColorPickerProps) {
    const [hsl, setHsl] = useState(() => rgbToHsl(defaultColor.r, defaultColor.g, defaultColor.b));
    const [rgb, setRgb] = useState(defaultColor);
    const [hex, setHex] = useState(rgbToHex(rgb.r, rgb.g, rgb.b));
    const [copied, setCopied] = useState(false);
    const colorPlaneRef = useRef<HTMLDivElement>(null);
    const isDraggingRef = useRef(false);

    // To prevent dependencies that might cause recursion
    const updateColorFromHsl = useCallback(
        (hsl: HSL) => {
            const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l);
            const newRgb = { r, g, b };
            setRgb(newRgb);
            setHex(rgbToHex(r, g, b));
            onChange && onChange(newRgb);
        },
        [onChange],
    );

    useEffect(() => {
        updateColorFromHsl(hsl);
    }, [hsl, updateColorFromHsl]);

    const updateColorFromPlane = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!colorPlaneRef.current) return;

        const rect = colorPlaneRef.current.getBoundingClientRect();
        const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);

        setHsl(prev => ({
            h: prev.h,
            s: x * 100,
            l: 100 - y * 100,
        }));
    }, []);

    const handleColorPlaneMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        isDraggingRef.current = true;
        updateColorFromPlane(e);

        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingRef.current) updateColorFromPlane(e);
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleHueChange = (value: number[]) => {
        setHsl(prev => ({ ...prev, h: value[0] }));
    };

    const handleRgbChange = (channel: keyof Color, value: string) => {
        const numValue = clamp(Number.parseInt(value) || 0, 0, 255);
        const newRgb = { ...rgb, [channel]: numValue };
        setRgb(newRgb);
        setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    };

    const handleHslChange = (channel: keyof HSL, value: string) => {
        const numValue = clamp(Number.parseInt(value) || 0, 0, channel === "h" ? 360 : 100);
        setHsl(prev => ({ ...prev, [channel]: numValue }));
    };

    const handleHexChange = (value: string) => {
        const color = hexToRgb(value);
        setRgb(color);
        setHsl(rgbToHsl(color.r, color.g, color.b));
        setHex(value);
    };

    const copyToClipboard = useCallback((text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }, []);

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
                        <Input value={hex} onChange={e => handleHexChange(e.target.value)} className="font-mono" />
                        <Button size="icon" variant="outline" onClick={() => copyToClipboard(hex)} className="shrink-0">
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="rgb" className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                        {["r", "g", "b"].map(channel => (
                            <div key={channel} className="space-y-1">
                                <Label htmlFor={`${channel}-value`} className="text-xs">
                                    {channel.toUpperCase()}
                                </Label>
                                <Input
                                    id={`${channel}-value`}
                                    type="number"
                                    min={0}
                                    max={255}
                                    value={rgb[channel as keyof Color]}
                                    onChange={e => handleRgbChange(channel as keyof Color, e.target.value)}
                                    className="font-mono"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Input value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} readOnly className="font-mono" />
                        <Button
                            size="icon"
                            variant="outline"
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
                                value={hsl.h}
                                onChange={e => handleHslChange("h", e.target.value)}
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
                                onChange={e => handleHslChange("s", e.target.value)}
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
                                onChange={e => handleHslChange("l", e.target.value)}
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
                            variant="outline"
                            onClick={() =>
                                copyToClipboard(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`)
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

function hexToRgb(hex: string): Color {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    // Expand shorthand form ('#03F') to full form ('#0033FF')
    if (hex.length === 3) {
        hex = hex.split('').map((char) => char + char).join('');
    }

    const bigint = parseInt(hex, 16);

    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
    const hr = r.toString(16).padStart(2, '0');
    const hg = g.toString(16).padStart(2, '0');
    const hb = b.toString(16).padStart(2, '0');

    return `#${hr}${hg}${hb}`;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
        s = delta / (1 - Math.abs(2 * l - 1));

        switch (max) {
            case r:
                h = ((g - b) / delta + (g < b ? 6 : 0)) % 6;
                break;
            case g:
                h = (b - r) / delta + 2;
                break;
            case b:
                h = (r - g) / delta + 4;
                break;
        }

        h *= 60;
    }

    return { h, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): Color {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hPrime = h / 60;
    const x = c * (1 - Math.abs((hPrime % 2) - 1));
    let r1 = 0,
        g1 = 0,
        b1 = 0;

    if (0 <= hPrime && hPrime < 1) {
        r1 = c;
        g1 = x;
        b1 = 0;
    } else if (1 <= hPrime && hPrime < 2) {
        r1 = x;
        g1 = c;
        b1 = 0;
    } else if (2 <= hPrime && hPrime < 3) {
        r1 = 0;
        g1 = c;
        b1 = x;
    } else if (3 <= hPrime && hPrime < 4) {
        r1 = 0;
        g1 = x;
        b1 = c;
    } else if (4 <= hPrime && hPrime < 5) {
        r1 = x;
        g1 = 0;
        b1 = c;
    } else if (5 <= hPrime && hPrime < 6) {
        r1 = c;
        g1 = 0;
        b1 = x;
    }

    const m = l - c / 2;

    const r = Math.round((r1 + m) * 255);
    const g = Math.round((g1 + m) * 255);
    const b = Math.round((b1 + m) * 255);

    return { r, g, b };
}
