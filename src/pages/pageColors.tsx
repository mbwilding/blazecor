import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/ColorPalette";
import { Color, Settings } from "@/types/ffi/settings";

export interface PageColorsProps {
    settings: Settings;
}

export default function PageColors({ settings }: PageColorsProps) {
    let palette = settings.paletteRgb || settings.paletteRgbw;
    let colorMap = settings.colorMap;

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        if (palette) {
            palette[index] = newColor;
        }
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <ColorPalette colors={palette || []} onChange={handleSelectedColorChange} />
            <LayoutDefy
                layer={0}
                darkMode={true}
                showUnderglow={true}
                isStandardView={false}
                colormap={colorMap}
                palette={palette}
                onKeySelect={e => console.log(e)}
            />
        </div>
    );
}
