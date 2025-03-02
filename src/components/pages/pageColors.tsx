import { Color, Settings } from "@/types/ffi/settings";
import { useState } from "react";
import { ColorPalette } from "../ui/color-palette";
import { LayoutDefy } from "../dygma/layouts/defy";

export interface PageColorsProps {
    settings: Settings,
}

export default function PageColors({ settings }: PageColorsProps) {
    const [colorIndex, setColorIndex] = useState<number>()

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        setColorIndex(index)
        console.log(`Color at index ${index} changed to: ${newColor.r}, ${newColor.g}, ${newColor.b}`);
    }

    return (
        <div className="container flex flex-col justify-center items-center">
            <ColorPalette colors={settings.paletteRgb || settings.paletteRgbw || []} onChange={handleSelectedColorChange} />
            <LayoutDefy
                layer={0}
                darkMode={true}
                showUnderglow={true}
                isStandardView={false}
                colormap={settings?.colorMap}
                palette={settings?.paletteRgb || settings?.paletteRgbw}
                onKeySelect={(e) => console.log(e)}
            />
        </div>
    );
}
