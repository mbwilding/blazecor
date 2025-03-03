import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { RGBW } from "@/types/ffi/settings";
import { rgbwToHex } from "@/utils/colorConverters";

interface HSV {
    h: number;
    s: number;
    v: number;
}

interface ColorPickerProps {
    index: number;
    defaultColor: RGBW;
    onChange?: (index: number, color: RGBW) => void;
    children: React.ReactNode;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ index, defaultColor, onChange, children }) => {
    const [color, setColor] = useState<RGBW>(defaultColor);
    const [hsv, setHsv] = useState<HSV>({ h: 0, s: 100, v: 100 });
    const [copied, setCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const hueSliderRef = useRef<HTMLDivElement>(null);

    const extractWhite = useCallback((r: number, g: number, b: number): { r: number; g: number; b: number; w: number } => {
        const w = Math.min(r, g, b);
        return {
            r: r - w,
            g: g - w,
            b: b - w,
            w,
        };
    }, []);

    const hsvToRgb = useCallback((h: number, s: number, v: number): { r: number; g: number; b: number } => {
        s /= 100;
        v /= 100;
        h = h * 6;
        const i = Math.floor(h);
        const f = h - i;
        const p = v * (1 - s);
        const q = v * (1 - f * s);
        const t = v * (1 - (1 - f) * s);
        let r, g, b;
        switch (i % 6) {
            case 0:
                (r = v), (g = t), (b = p);
                break;
            case 1:
                (r = q), (g = v), (b = p);
                break;
            case 2:
                (r = p), (g = v), (b = t);
                break;
            case 3:
                (r = p), (g = q), (b = v);
                break;
            case 4:
                (r = t), (g = p), (b = v);
                break;
            case 5:
                (r = v), (g = p), (b = q);
                break;
            default:
                (r = 0), (g = 0), (b = 0);
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    }, []);

    const rgbwToHsv = useCallback((r: number, g: number, b: number, w: number): HSV => {
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
    }, []);

    useEffect(() => {
        setHsv(rgbwToHsv(color.r, color.g, color.b, color.w));
    }, [color, rgbwToHsv]);

    useEffect(() => {
        onChange && onChange(index, color);
    }, [color, index]);

    const updateColor = useCallback(
        (newColor: Partial<RGBW>) => {
            const updatedColor = { ...color, ...newColor };
            setColor(updatedColor);
        },
        [color],
    );

    const updateHsv = useCallback(
        (newHsv: Partial<HSV>) => {
            const updatedHsv = { ...hsv, ...newHsv };
            setHsv(updatedHsv);
            const { r, g, b } = hsvToRgb(updatedHsv.h / 360, updatedHsv.s, updatedHsv.v);
            const extractedColor = extractWhite(r, g, b);
            setColor(extractedColor);
        },
        [hsv, hsvToRgb, extractWhite],
    );

    const handleColorPickerChange = useCallback(
        (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            const rect = colorPickerRef.current!.getBoundingClientRect();
            const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
            const clientY = "touches" in event ? event.touches[0].clientY : event.clientY;
            const x = clientX - rect.left;
            const y = clientY - rect.top;
            const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
            const v = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
            updateHsv({ s, v });
        },
        [updateHsv],
    );

    const handleHueChange = useCallback(
        (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            const rect = hueSliderRef.current!.getBoundingClientRect();
            const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
            const x = clientX - rect.left;
            const h = Math.max(0, Math.min(360, (x / rect.width) * 360));
            updateHsv({ h });
        },
        [updateHsv],
    );

    const handleMouseDown = useCallback(
        (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
            setIsDragging(true);
            if ("button" in event && event.button !== 0) return; // Only handle left mouse button
            if ("currentTarget" in event && event.currentTarget === colorPickerRef.current) {
                handleColorPickerChange(event);
            } else if ("currentTarget" in event && event.currentTarget === hueSliderRef.current) {
                handleHueChange(event);
            }
        },
        [handleColorPickerChange, handleHueChange],
    );

    const handleMouseMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            if (event.target === colorPickerRef.current) {
                handleColorPickerChange(event as any);
            } else if (event.target === hueSliderRef.current) {
                handleHueChange(event as any);
            }
        },
        [isDragging, handleColorPickerChange, handleHueChange],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            window.addEventListener("touchend", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            window.removeEventListener("touchend", handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(rgbwToHex(color));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-[300px]">
                <div className="space-y-4">
                    <div
                        ref={colorPickerRef}
                        className="w-full h-[200px] rounded-md cursor-crosshair relative"
                        style={{
                            backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                            backgroundImage: `
                  linear-gradient(to right, #fff, transparent),
                  linear-gradient(to top, #000, transparent)
                `,
                        }}
                        onMouseDown={handleMouseDown}
                        onTouchStart={handleMouseDown}
                    >
                        <div
                            className="w-4 h-4 rounded-full border-2 border-white absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                            style={{
                                left: `${hsv.s}%`,
                                top: `${100 - hsv.v}%`,
                                backgroundColor: `hsl(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Hue</Label>
                        <div
                            ref={hueSliderRef}
                            className="w-full h-4 rounded-md cursor-pointer relative"
                            style={{
                                backgroundImage: `linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)`,
                            }}
                            onMouseDown={handleMouseDown}
                            onTouchStart={handleMouseDown}
                        >
                            <div
                                className="w-4 h-4 rounded-full border-2 border-white absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                                style={{
                                    left: `${(hsv.h / 360) * 100}%`,
                                    backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
                                }}
                            />
                        </div>
                    </div>

                    <Tabs defaultValue="rgbw">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="rgbw">RGBW</TabsTrigger>
                            <TabsTrigger value="hsv">HSV</TabsTrigger>
                        </TabsList>
                        <TabsContent value="rgbw" className="space-y-2">
                            {["r", "g", "b", "w"].map(channel => (
                                <div key={channel} className="grid grid-cols-[1fr_60px] items-center gap-2">
                                    <div>
                                        <Label htmlFor={`${channel}-slider`} className="text-xs font-bold uppercase">
                                            {channel}
                                        </Label>
                                        <Slider
                                            id={`${channel}-slider`}
                                            min={0}
                                            max={255}
                                            step={1}
                                            value={[color[channel as keyof RGBW]]}
                                            onValueChange={([value]) => updateColor({ [channel]: value })}
                                        />
                                    </div>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={255}
                                        value={color[channel as keyof RGBW]}
                                        onChange={e => updateColor({ [channel]: Number(e.target.value) })}
                                        className="h-8"
                                    />
                                </div>
                            ))}
                        </TabsContent>
                        <TabsContent value="hsv" className="space-y-2">
                            {[
                                { channel: "h", max: 360, label: "Hue" },
                                { channel: "s", max: 100, label: "Saturation" },
                                { channel: "v", max: 100, label: "Value" },
                            ].map(({ channel, max, label }) => (
                                <div key={channel} className="grid grid-cols-[1fr_60px] items-center gap-2">
                                    <div>
                                        <Label htmlFor={`${channel}-slider`} className="text-xs font-bold">
                                            {label}
                                        </Label>
                                        <Slider
                                            id={`${channel}-slider`}
                                            min={0}
                                            max={max}
                                            step={1}
                                            value={[hsv[channel as keyof HSV]]}
                                            onValueChange={([value]) => updateHsv({ [channel]: value })}
                                        />
                                    </div>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={max}
                                        value={Math.round(hsv[channel as keyof HSV])}
                                        onChange={e => updateHsv({ [channel]: Number(e.target.value) })}
                                        className="h-8"
                                    />
                                </div>
                            ))}
                        </TabsContent>
                    </Tabs>

                    <div className="flex items-center gap-2">
                        <Input value={rgbwToHex(color)} readOnly className="h-8" />
                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default ColorPicker;
