import "./App.css";
import { Button } from "./components/ui/button";
import { Device } from "./types/ffi/hardware";
import { LayoutDefy } from "./components/dygma/layouts/defy";
import { useConnect, useDevices, useSettings, useVersion } from "./Api";
import { useState } from "react";

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
                        </>
                    )}

                    <LayoutDefy
                        layer={0}
                        darkMode={true}
                        showUnderglow={true}
                        isStandardView={false}
                        colormap={settings?.colorMap}
                        palette={settings?.paletteRgb || settings?.paletteRgbw}
                        onKeySelect={(e) => console.log(e)}
                    />
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
