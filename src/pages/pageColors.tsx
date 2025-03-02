import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useState } from "react";
import { Device } from "@/types/ffi/hardware";

export interface PageColorsProps {
    device: Device;
    settings: Settings;
}

export default function PageColors({ device, settings }: PageColorsProps) {
    const [currentLayer, setCurrentLayer] = useState(settings.settingsDefaultLayer + 1);
    const [palette, setPalette] = useState(device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb);
    const [colorMap, setColorMap] = useState(settings.colorMap); // TODO: Slice the array

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        if (palette) {
            palette[index] = newColor;
        }
    };

    const handleSelectedLayerChange = (index: number) => {
        setCurrentLayer(index);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <ColorPalette colors={palette || []} onChange={handleSelectedColorChange} />
            <LayerSelector defaultLayer={currentLayer} layers={10} onChange={handleSelectedLayerChange} />
            <LayoutDefy
                layer={currentLayer - 1}
                darkMode={true}
                showUnderglow={device.hardware.keyboardUnderglow !== undefined}
                isStandardView={false}
                colormap={colorMap}
                palette={palette}
                onKeySelect={e => console.log(e)}
            />
        </div>
    );
}
