import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/ColorPalette";
import { Color, Settings } from "@/types/ffi/settings";

export interface PageColorsProps {
    settings: Settings;
}

export default function PageColors({ settings }: PageColorsProps) {
    const handleSelectedColorChange = (index: number, newColor: Color) => {
        let palette = settings.paletteRgb || settings.paletteRgbw;
        if (palette) {
            palette[index] = newColor;
        }
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
