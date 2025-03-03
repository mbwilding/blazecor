import LayoutDefy from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { RGB, RGBW, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useEffect, useState } from "react";
import { Device } from "@/types/ffi/hardware";
import { Container } from "@/components/custom/container";
import { KeyType } from "@/components/dygma/types/layout";
import { Button } from "@/components/ui/button";

export interface PageColorsProps {
    device: Device;
    settings: Settings;
}

// NOTE: Defy
const layers = 10;
const keys = 80;
const leds = 177;

export default function PageColors({ device, settings }: PageColorsProps) {
    const [currentLayer, setCurrentLayer] = useState(settings.settingsDefaultLayer);
    const [colorMap, setColorMap] = useState(settings.colorMap.slice(currentLayer, leds));
    const [keyMap, _setKeyMap] = useState(settings.keymapCustom.slice(currentLayer, keys));
    const [palette, setPalette] = useState(device.hardware.rgbwMode ? settings.paletteRgbw : settings.paletteRgb);

    // TODO: Figure out what is what, svg does math to calculate indexes into keymap array
    const keymap: KeyType[] = keyMap.map((_, index) => ({
        keyCode: index, // TODO: 255 is max
        label: index.toString(),
        extraLabel: "",
        // extraLabel: _.toString(),
        verbose: undefined,
        alt: false,
    }));

    useEffect(() => {
        const colorMapIndex = currentLayer * leds + currentLayer;
        setColorMap(settings.colorMap.slice(colorMapIndex, colorMapIndex + leds));
    }, [currentLayer]);

    const handleSelectedColorChange = (index: number, color: RGB | RGBW) => {
        if (palette) {
            const newPalette = [...palette];
            newPalette[index] = color;
            setPalette(newPalette);
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
                    <Button variant="outline">Apply</Button>
                    <Button variant="outline">Reset</Button>
                </Container>
                <Container title="Layers">
                    <LayerSelector defaultLayer={currentLayer + 1} layers={layers} onChange={handleSelectedLayerChange} />
                </Container>
            </div>

            <LayoutDefy
                layer={currentLayer}
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
