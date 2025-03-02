import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useState } from "react";

export interface PageColorsProps {
    settings: Settings;
}

export default function PageColors({ settings }: PageColorsProps) {
    const [selectedLayer, setSelectedLayer] = useState(settings.settingsDefaultLayer + 1);

    let palette = settings.paletteRgb || settings.paletteRgbw;
    let colorMap = settings.colorMap;

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        if (palette) {
            palette[index] = newColor;
        }
    };

    const handleSelectedLayerChange = (index: number) => {
        setSelectedLayer(index);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <ColorPalette colors={palette || []} onChange={handleSelectedColorChange} />
            <LayerSelector defaultLayer={selectedLayer} layers={10} onChange={handleSelectedLayerChange} />
            <LayoutDefy
                layer={selectedLayer}
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
