import LayoutDefy from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useEffect, useState } from "react";
import { Device } from "@/types/ffi/hardware";
import { Container } from "@/components/custom/container";
import { KeyType } from "@/components/dygma/types/layout";

export interface PageColorsProps {
    device: Device;
    settings: Settings;
}

// NOTE: Defy
const layers = 10;
const leds = 177;
const keymap: KeyType[] = Array(90).fill(
    {
        keyCode: 50,
        label: "x",
        extraLabel: "",
        verbose: "",
        alt: false,
    }
);

export default function PageColors({ device, settings }: PageColorsProps) {
    const [currentLayer, setCurrentLayer] = useState(settings.settingsDefaultLayer);
    const [colorMap, setColorMap] = useState(() => settings.colorMap.slice(0, leds));

    useEffect(() => {
        const colorMapIndex = currentLayer * leds + currentLayer;
        setColorMap(settings.colorMap.slice(colorMapIndex, colorMapIndex + leds));
    }, [currentLayer]);

    const palette = device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb;

    const handleSelectedColorChange = (index: number, newColor: Color) => {
        // TODO: useState, but it falt when setting
        if (palette) {
            palette[index] = newColor;
        }
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
