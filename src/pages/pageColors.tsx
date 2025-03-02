import { LayoutDefy } from "@/components/dygma/layouts/defy";
import { ColorPalette } from "@/components/custom/color-palette";
import { Color, Settings } from "@/types/ffi/settings";
import { LayerSelector } from "@/components/custom/layer-selector";
import { useEffect, useState } from "react";
import { Device } from "@/types/ffi/hardware";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface PageColorsProps {
    device: Device;
    settings: Settings;
}

// NOTE: Defy
const layers = 10;
const leds = 177;

export default function PageColors({ device, settings }: PageColorsProps) {
    const [currentLayer, setCurrentLayer] = useState(settings.settingsDefaultLayer);
    const [colorMap, setColorMap] = useState(() => settings.colorMap.slice(0, leds));

    useEffect(() => {
        const colorMapIndex = currentLayer * leds + currentLayer;
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
            <div className="flex flex-row gap-4">
              <Card className="w-fit flex flex-row items-center">
                <CardHeader>
                  <CardTitle>Palette</CardTitle>
                </CardHeader>
                <CardContent>
                  <ColorPalette colors={palette || []} onChange={handleSelectedColorChange} />
                </CardContent>
              </Card>
              <Card className="w-fit flex flex-row items-center">
                <CardHeader>
                  <CardTitle>Layers</CardTitle>
                </CardHeader>
                <CardContent>
                  <LayerSelector defaultLayer={currentLayer + 1} layers={layers} onChange={handleSelectedLayerChange} />
                </CardContent>
              </Card>
            </div>
            <LayoutDefy
                layer={currentLayer + 1} // TODO: Remove + 1?
                darkMode={true}
                showUnderglow={device.hardware.keyboardUnderglow !== undefined}
                isStandardView={false}
                colorMap={colorMap}
                palette={palette}
                onKeySelect={e => console.log(e)}
            />
        </div>
    );
}
