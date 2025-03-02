import "./App.css";
import { Button } from "./components/ui/button";
import { Device } from "./types/ffi/hardware";
import { useConnect, useDevices, useSettings, useVersion } from "./Api";
import { useState } from "react";
import { Color } from "./types/ffi/settings";
import PageColors from "./components/pages/pageColors";

// TODO: Move
document.documentElement.classList.add("dark");

function App() {
    const [device, setDevice] = useState<Device>();
    const { devices, fetchDevices } = useDevices();

    useConnect(device);

    const version = useVersion(device);
    const settings = useSettings(device);

    return (
        <main className="container">
            {device ? (
                <>
                    {version && (
                        <div id="version" className="text-lime-300">
                            {"Version: " + version}
                        </div>
                    )}

                    {settings && (
                        <>
                            <div id="settings" className="text-pink-300">
                                {"Mouse Speed: " + settings.mouseSpeed}
                            </div>

                            <div id="color-map" className="text-amber-300">
                                <h2>Color Map</h2>
                                {settings.colorMap?.map((x, index) => (
                                    <span key={index}>{x},</span>
                                ))}
                            </div>

                            <div id="palette-rgbw" className="text-blue-300">
                                <span>Palette: </span>
                                {settings.paletteRgbw?.map((x, index) => (
                                    <span
                                        key={index}
                                        className="inline-block w-5 h-5 text-white text-center leading-5"
                                        style={{ backgroundColor: `rgb(${x.r}, ${x.g}, ${x.b})` }}
                                    >
                                        {index}
                                    </span>
                                ))}
                            </div>

                            {
                                // TODO: Remove

                                // <div className="w-full max-w-3xl mx-auto p-6 bg-card rounded-lg shadow-sm border">
                                //     <h1 className="text-2xl font-bold mb-6">Color Palette</h1>
                                //     <ColorPalette colors={settings.paletteRgb || settings.paletteRgbw || []} onChange={handleColorChange} />
                                // </div>
                            }

                            <PageColors settings={settings} />
                        </>
                    )}
                </>
            ) : (
                <>
                    <form
                        className="row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchDevices();
                        }}
                    >
                        <Button type="submit">Devices</Button>
                    </form>

                    {devices?.map((device, index) => (
                        <Button
                            key={index}
                            type="button"
                            onClick={() => setDevice(device)}
                        >
                            {device.hardware.info.displayName}
                        </Button>
                    ))}
                </>
            )}
        </main>
    );
}

export default App;
