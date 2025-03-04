import React, { useCallback, useEffect, useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { RGBW, HSV } from "@/types/colors";
import { hsvToRgb, rgbToRgbw, rgbwToHex, rgbwToHsv } from "@/utils/colorConverters";

interface ColorPickerProps {
    index: number;
    color: RGBW;
    onChange?: (index: number, color: RGBW) => void;
    children: React.ReactNode;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ index, color, onChange, children }) => {
    const [hsv, setHsv] = useState<HSV>(rgbwToHsv(color));
    const [copied, setCopied] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [draggingElement, setDraggingElement] = useState<"colorPicker" | "hueSlider" | null>(null);
    const colorPickerRef = useRef<HTMLDivElement>(null);
    const hueSliderRef = useRef<HTMLDivElement>(null);

    const rgbwToHexLocal = (rgbw: RGBW): string => {
        return rgbwToHex(rgbw);
    };

    useEffect(() => {
        setHsv(rgbwToHsv(color));
    }, [color]);

    const updateColor = useCallback(
        (newColor: Partial<RGBW>) => {
            const updatedColor: RGBW = { ...color, ...newColor };
            onChange && onChange(index, updatedColor);
        },
        [color, index, onChange],
    );

    const updateHsv = useCallback(
        (newHsv: Partial<HSV>) => {
            const updatedHsv = { ...hsv, ...newHsv };
            setHsv(updatedHsv);
            const rgb = hsvToRgb(updatedHsv);
            onChange && onChange(index, rgbToRgbw(rgb));
        },
        [hsv, index, onChange],
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
            if ("button" in event && event.button !== 0) return; // Only handle left mouse button
            setIsDragging(true);
            if (colorPickerRef.current && event.currentTarget === colorPickerRef.current) {
                setDraggingElement("colorPicker");
                handleColorPickerChange(event);
            } else if (hueSliderRef.current && event.currentTarget === hueSliderRef.current) {
                setDraggingElement("hueSlider");
                handleHueChange(event);
            }
        },
        [handleColorPickerChange, handleHueChange],
    );

    const handleMouseMove = useCallback(
        (event: MouseEvent | TouchEvent) => {
            if (!isDragging || !draggingElement) return;
            if (draggingElement === "colorPicker") {
                handleColorPickerChange(event as any);
            } else if (draggingElement === "hueSlider") {
                handleHueChange(event as any);
            }
        },
        [isDragging, draggingElement, handleColorPickerChange, handleHueChange],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setDraggingElement(null);
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
        navigator.clipboard.writeText(rgbwToHexLocal(color));
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

                    <div className="space-y-2">
                        {["r", "g", "b", "w"].map(channel => (
                            <div key={channel} className="grid grid-cols-[1fr_72px] items-center gap-2">
                                <div>
                                    <Label htmlFor={`${channel}-slider`} className="text-xs font-bold uppercase mb-3">
                                        {channel.toUpperCase()}
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
                                    className="h-12 w-18"
                                />
                            </div>
                        ))}

                    </div>

                    <div className="flex items-center gap-2">
                        <Input value={rgbwToHexLocal(color)} readOnly className="h-8" />
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
