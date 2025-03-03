import { ReactNode, useState } from "react";
import { RgbColorPicker } from "react-colorful";
import { colord } from "colord";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { RGB, RGBW } from "@/types/ffi/settings";

interface ColorPickerProps {
    index: number;
    defaultColor: RGB | RGBW;
    onChange?: (index: number, color: RGB | RGBW) => void;
    children: ReactNode;
}

export default function ColorPicker({ index, defaultColor, onChange, children }: ColorPickerProps) {
    const [color, setColor] = useState<RGB | RGBW>(defaultColor);

    const handleColorChange = (newColor: RGB | RGBW) => {
        setColor(newColor);
        onChange && onChange(index, newColor);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-full">
                <RgbColorPicker color={color} onChange={handleColorChange} />
                <Input
                    className="font-mono"
                    maxLength={7}
                    onChange={e => {
                        const hex = e.currentTarget.value.trim();
                        const newColor = colord(hex).toRgb();
                        if (colord(hex).isValid()) {
                            handleColorChange(newColor);
                        }
                    }}
                    value={colord(color).toHex()}
                />
            </PopoverContent>
        </Popover>
    );
}
