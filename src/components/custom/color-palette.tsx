import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RGBW } from "@/types/ffi/settings";
import ColorPicker from "./color-picker";

interface ColorPaletteProps {
    colors: RGBW[];
    onChange?: (index: number, color: RGBW) => void;
}

export function ColorPalette({ colors: initialColors, onChange }: ColorPaletteProps) {
    const [colors, setColors] = useState<RGBW[]>(initialColors);

    const handleColorChange = useCallback(
        (index: number, color: RGBW) => {
            const newColors = [...colors];
            newColors[index] = color;
            setColors(newColors);
            onChange?.(index, color);
        },
        [colors, onChange],
    );

    return (
        <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
                <ColorPicker key={index} index={index} defaultColor={color} onChange={handleColorChange}>
                    <Button
                        variant="outline"
                        className={cn("h-9 w-9 p-0 rounded-md", "border border-border shadow-sm hover:border-accent")}
                        style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b}, ${color.w})` }}
                    />
                </ColorPicker>
            ))}
        </div>
    );
}
