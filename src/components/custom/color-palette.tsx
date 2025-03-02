import { useState, useCallback, memo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Color } from "@/types/ffi/settings";
import { ColorPicker } from "./color-picker";

interface ColorPaletteProps {
    colors: Color[];
    onChange?: (index: number, color: Color) => void;
}

const ColorSwatch = memo(
    ({
        color,
        index,
        selected,
        onClick,
    }: {
        color: Color;
        index: number;
        selected: boolean;
        onClick: (index: number) => void;
    }) => (
        <Button
            variant={selected ? "default" : "outline"}
            className={cn(
                "h-10 w-10 p-0 rounded-md",
                selected ? "border-2 border-primary shadow-sm" : "border border-border shadow-sm hover:border-accent",
            )}
            style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
            onClick={() => onClick(index)}
            aria-pressed={selected}
        />
    ),
);

ColorSwatch.displayName = "ColorSwatch";

export function ColorPalette({ colors, onChange }: ColorPaletteProps) {
    const [selectedColor, setSelectedColor] = useState<Color>();
    const [selectedIndex, setSelectedIndex] = useState<number>();

    const handleSwatchClick = useCallback(
        (index: number) => {
            setSelectedColor(colors[index]);
            setSelectedIndex(index);
        },
        [colors],
    );

    const handleColorChange = useCallback(
        (color: Color) => {
            setSelectedColor(color);
            if (selectedIndex !== undefined) {
                colors[selectedIndex] = color;
                onChange?.(selectedIndex, color);
            }
        },
        [selectedIndex, onChange, colors],
    );

    return (
        <div className="flex flex-wrap gap-2">
            {colors.map((color, index) => (
                <Dialog key={index}>
                    <DialogTrigger asChild>
                        <div>
                            <ColorSwatch
                                color={color}
                                index={index}
                                selected={selectedIndex === index}
                                onClick={handleSwatchClick}
                            />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit Color</DialogTitle>
                        </DialogHeader>
                        <ColorPicker defaultColor={selectedColor || color} onChange={handleColorChange} />
                    </DialogContent>
                </Dialog>
            ))}
        </div>
    );
}
