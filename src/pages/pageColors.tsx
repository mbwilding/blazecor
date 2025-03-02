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
    const [selectedLayer, setSelectedLayer] = useState(settings.settingsDefaultLayer + 1);

    let palette = device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb;

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
                layer={selectedLayer - 1}
                darkMode={true}
                showUnderglow={device.hardware.keyboardUnderglow !== undefined}
                isStandardView={false}
                colormap={settings.colorMap} // TODO: Slice the array
                palette={palette}
                onKeySelect={e => console.log(e)}
            />
        </div>
    );
}
