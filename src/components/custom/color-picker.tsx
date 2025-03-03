import { ReactNode, useState } from "react";
import { RgbaColorPicker, RgbColorPicker } from "react-colorful";
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
            <PopoverContent className="flex flex-col w-full gap-4 items-center">
                <RgbColorPicker color={color} onChange={handleColorChange} />
                <RgbaColorPicker color={color} onChange={handleColorChange} />
                <Input
                    className="font-mono w-51 text-center"
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
