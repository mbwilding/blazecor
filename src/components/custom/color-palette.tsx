import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RGB } from "@/types/ffi/settings";
import ColorPicker from "./color-picker";

interface ColorPaletteProps {
    colors: RGB[];
    onChange?: (index: number, color: RGB) => void;
}

export function ColorPalette({ colors, onChange }: ColorPaletteProps) {
    const handleColorChange = useCallback(
        (index: number, color: RGB) => {
            colors[index] = color;
            onChange?.(index, color);
        },
        [colors, onChange],
    );

    return (
        <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
                <ColorPicker index={index} defaultColor={color} onChange={handleColorChange}>
                    <Button
                        variant="outline"
                        className={cn("h-10 w-10 p-0 rounded-md", "border border-border shadow-sm hover:border-accent")}
                        style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                    />
                </ColorPicker>
            ))}
        </div>
    );
}
