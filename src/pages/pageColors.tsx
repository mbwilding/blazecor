import LayoutDefy from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useEffect, useState } from "react";
import { Device, Product } from "@/types/ffi/hardware";
import { Container } from "@/components/custom/container";
import { KeyType } from "@/components/dygma/types/layout";
import { Button } from "@/components/ui/button";
import { paletteSet } from "@/Api";
import { RGBW } from "@/types/colors";

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
    const [keyMap, setKeyMap] = useState(settings.keymapCustom.slice(currentLayer, keys));

    const [palette, setPalette] = useState(structuredClone(settings.paletteRgbw));

    // TODO: Figure out what is what, svg does math to calculate indexes into keymap array
    const keymap: KeyType[] = keyMap.map((_, index) => ({
        keyCode: index, // TODO: 255 is max
        label: "", // index.toString(),
        extraLabel: "",
        // extraLabel: _.toString(),
        verbose: undefined,
        alt: false,
    }));

    useEffect(() => {
        const colorMapIndex = currentLayer * leds + currentLayer;
        setColorMap(settings.colorMap.slice(colorMapIndex, colorMapIndex + leds));
    }, [currentLayer]);

    const handleSelectedColorChange = (index: number, color: RGBW) => {
        if (palette) {
            const newPalette = [...palette];
            newPalette[index] = color;
            setPalette(newPalette);
        }
    };

    const handleSelectedLayerChange = (index: number) => {
        setCurrentLayer(index - 1);
    };

    const handleApply = async () => {
        settings.paletteRgbw = palette;
        await paletteSet(true, palette);
    };

    const handleReset = () => {
        setPalette(settings.paletteRgbw);
    };

    return (
        <div className="flex flex-col justify-center items-center m-4">
            <div className="flex flex-row gap-4">
                <Container title="Palette">
                    <ColorPalette product={Product.Defy} colors={palette || []} onChange={handleSelectedColorChange} />
                </Container>
                <Container title="Layers">
                    <LayerSelector defaultLayer={currentLayer + 1} layers={layers} onChange={handleSelectedLayerChange} />
                </Container>
            </div>

            <LayoutDefy
                className="w-full"
                layer={currentLayer}
                darkMode={true}
                showUnderglow={device.hardware.keyboardUnderglow !== undefined}
                isStandardView={false}
                colorMap={colorMap}
                palette={palette}
                keymap={keymap}
                onKeySelect={e => console.log(e)}
            />

            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                <Container className="gap-6">
                    <Button variant="success" onClick={handleApply}>
                        Apply
                    </Button>
                    <Button variant="destructive" onClick={handleReset}>
                        Reset
                    </Button>
                </Container>
            </div>
        </div>
    );
}
