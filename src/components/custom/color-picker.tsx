import { useState } from 'react';
import { RgbColorPicker } from 'react-colorful';
import { colord } from 'colord';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { RGB } from "@/types/ffi/settings";

interface ColorPickerProps {
    key: number;
    defaultColor: RGB;
    onChange?: (index: number, color: RGB) => void;
}

export default function ColorPicker({ key, defaultColor, onChange }: ColorPickerProps) {
    const [color, setColor] = useState<RGB>(defaultColor);

    const handleColorChange = (newColor: RGB) => {
        setColor(newColor);
        if (onChange) {
            onChange(key, newColor);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                    variant='outline'
                    size='icon'
                >
                    <div />
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-full'>
                <RgbColorPicker color={color} onChange={handleColorChange} />
                <Input
                    maxLength={7}
                    onChange={(e) => {
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
