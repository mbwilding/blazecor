import { useState, useCallback, memo } from "react"
import { ColorPicker } from "./color-picker"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Color } from "@/types/ffi/settings"

interface ColorPaletteProps {
    colors: Color[]
    onChange?: (index: number, color: Color) => void
}

const ColorSwatch = memo(
    ({ color, index, onClick }: { color: Color; index: number; onClick: (index: number) => void }) => (
        <button
            className="w-12 h-12 rounded-md border border-border shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mr-2 last:mr-0 flex-shrink-0"
            style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
            onClick={() => onClick(index)}
        />
    ),
)

ColorSwatch.displayName = "ColorSwatch"

export function ColorPalette({ colors, onChange }: ColorPaletteProps) {
    const [selectedColor, setSelectedColor] = useState<Color | null>(null)
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

    const handleSwatchClick = useCallback(
        (index: number) => {
            setSelectedColor(colors[index])
            setSelectedIndex(index)
        },
        [colors],
    )

    const handleColorChange = useCallback(
        (color: Color) => {
            setSelectedColor(color)
            if (selectedIndex !== null && onChange) {
                onChange(selectedIndex, color)
            }
        },
        [selectedIndex, onChange],
    )

    return (
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
            <div className="flex p-4">
                {colors.map((color, index) => (
                    <Dialog key={index}>
                        <DialogTrigger asChild>
                            <ColorSwatch color={color} index={index} onClick={handleSwatchClick} />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Edit Color</DialogTitle>
                            </DialogHeader>
                            <ColorPicker defaultColor={selectedColor || color} onChange={handleColorChange} />
                        </DialogContent>
                    </Dialog>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    )
}
