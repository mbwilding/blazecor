import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/ui/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { useState } from "react";

export interface PageColorsProps {
    settings: Settings;
}

export default function PageColors({ settings }: PageColorsProps) {
    const [colorIndex, setColorIndex] = useState<number>();

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        setColorIndex(index);
        console.log(`Color at index ${index} changed to: ${newColor.r}, ${newColor.g}, ${newColor.b}`);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <ColorPalette colors={settings.paletteRgb || settings.paletteRgbw || []} onChange={handleSelectedColorChange} />
            <LayoutDefy
                layer={0}
                darkMode={true}
                showUnderglow={true}
                isStandardView={false}
                colormap={settings?.colorMap}
                palette={settings?.paletteRgb || settings?.paletteRgbw}
                onKeySelect={e => console.log(e)}
            />
        </div>
    );
}
