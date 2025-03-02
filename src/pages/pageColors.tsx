import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useEffect, useState } from "react";
import { Device } from "@/types/ffi/hardware";

export interface PageColorsProps {
    device: Device;
    settings: Settings;
}

export default function PageColors({ device, settings }: PageColorsProps) {
    const [currentLayer, setCurrentLayer] = useState(settings.settingsDefaultLayer);
    const leds = 177;
    const [colorMap, setColorMap] = useState(() => settings.colorMap.slice(0, leds));

    useEffect(() => {
        const colorMapIndex = currentLayer + currentLayer * leds;
        setColorMap(settings.colorMap.slice(colorMapIndex, colorMapIndex + leds));
    }, [currentLayer]);

    const palette = device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb;

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        if (palette) {
            palette[index] = newColor;
        }
    };

    const handleSelectedLayerChange = (index: number) => {
        setCurrentLayer(index - 1);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <ColorPalette colors={palette || []} onChange={handleSelectedColorChange} />
            <LayerSelector defaultLayer={currentLayer + 1} layers={10} onChange={handleSelectedLayerChange} />
            <LayoutDefy
                layer={currentLayer + 1} // TODO: +1?
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
