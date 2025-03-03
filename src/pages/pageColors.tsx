import LayoutDefy from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useEffect, useState } from "react";
import { Device } from "@/types/ffi/hardware";
import { Container } from "@/components/custom/container";

export interface PageColorsProps {
    device: Device;
    settings: Settings;
}

// NOTE: Defy
const layers = 10;
const leds = 177;
const keymap = Array(80).fill({ keyCode: "0" }); // TODO: Implement from Bazecor

export default function PageColors({ device, settings }: PageColorsProps) {
    const [currentLayer, setCurrentLayer] = useState(settings.settingsDefaultLayer);
    const [colorMap, setColorMap] = useState(() => settings.colorMap.slice(0, leds));
    const [palette, setPalette] = useState(device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb);

    useEffect(() => {
        const colorMapIndex = currentLayer * leds + currentLayer;
        setColorMap(settings.colorMap.slice(colorMapIndex, colorMapIndex + leds));
    }, [currentLayer]);

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        // const newPalette = [...palette || []];
        // newPalette[index] = newColor;
        // setPalette(newPalette);

        // HACK: Top code not working, even then, this isn't re-rendering
        let hackPalette = device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb
        hackPalette![index] = newColor;

        setPalette(palette);
    };

    const handleSelectedLayerChange = (index: number) => {
        setCurrentLayer(index - 1);
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="flex flex-row gap-4">
                <Container title="Palette">
                    <ColorPalette colors={palette || []} onChange={handleSelectedColorChange} />
                </Container>
                <Container title="Layers">
                    <LayerSelector defaultLayer={currentLayer + 1} layers={layers} onChange={handleSelectedLayerChange} />
                </Container>
            </div>

            <LayoutDefy
                layer={currentLayer + 1} // TODO: Remove + 1?
                darkMode={true}
                showUnderglow={device.hardware.keyboardUnderglow !== undefined}
                isStandardView={false}
                colorMap={colorMap}
                palette={palette || []}
                keymap={keymap}
                onKeySelect={e => console.log(e)}
            />
        </div>
    );
}
