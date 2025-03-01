import { useEffect, useState } from "react";
import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/ui/button";
import { LayoutDefy } from "./components/dygma/layouts/defy";
import { Device } from "./types/ffi/hardware";
import { RGBW, Settings } from "./types/ffi/settings";

// TODO: Move
document.documentElement.classList.add("dark");

function useInvokeWithPort(device: Device | undefined) {
    return async function <T>(call: string, args?: InvokeArgs): Promise<T> {
        if (device) {
            const port = device.serialPort;
            return await invoke<T>(call, { port, args });
        } else {
            throw new Error("Cannot contact device");
        }
    };
}

function useDevices() {
    const [devices, setDevices] = useState<Device[]>();

    const fetchDevices = async () => {
        try {
            const devices = await invoke<Device[]>("find_all_devices");
            setDevices(devices);
        } catch (error) {
            console.error(error);
            setDevices(undefined);
        }
    };

    return { devices, fetchDevices };
}

function useConnect(device: Device | undefined) {
    const invokeWithPort = useInvokeWithPort(device);

    useEffect(() => {
        const connectDevice = async () => {
            try {
                await invokeWithPort("connect");
            } catch (error) {
                console.error(error);
            }
        };

        if (device) {
            connectDevice();
        }
    }, [device]);
}

function useVersion(device: Device | undefined) {
    const [version, setVersion] = useState<string>();
    const invokeWithPort = useInvokeWithPort(device);

    useEffect(() => {
        const fetchVersion = async () => {
            try {
                const version = await invokeWithPort<string>("version");
                setVersion(version);
            } catch (error) {
                console.error(error);
                setVersion(undefined);
            }
        };

        if (device) {
            fetchVersion();
        } else {
            setVersion(undefined);
        }
    }, [device]);

    return version;
}

function usePaletteRGBW(device: Device | undefined) {
    const [paletteRGBW, setPaletteRGBW] = useState<RGBW[]>();
    const invokeWithPort = useInvokeWithPort(device);

    useEffect(() => {
        const fetchPaletteRGBW = async () => {
            try {
                const palette = await invokeWithPort<RGBW[]>("palette_rgbw_get");
                setPaletteRGBW(palette);
            } catch (error) {
                console.error(error);
                setPaletteRGBW(undefined);
            }
        };

        if (device) {
            fetchPaletteRGBW();
        } else {
            setPaletteRGBW(undefined);
        }
    }, [device]);

    return paletteRGBW;
}

function useColorMap(device: Device | undefined) {
    const [colorMap, setColorMap] = useState<number[]>();
    const invokeWithPort = useInvokeWithPort(device);

    useEffect(() => {
        const fetchColorMap = async () => {
            try {
                const colorMap = await invokeWithPort<number[]>("color_map_get");
                setColorMap(colorMap);
            } catch (error) {
                console.error(error);
                setColorMap(undefined);
            }
        };

        if (device) {
            fetchColorMap();
        } else {
            setColorMap(undefined);
        }
    }, [device]);

    return colorMap;
}

function App() {
    const [device, setDevice] = useState<Device>();
    const { devices, fetchDevices } = useDevices();

    useConnect(device);

    const version = useVersion(device);
    const paletteRGBW = usePaletteRGBW(device);
    const colorMap = useColorMap(device);

    return (
        <main className="container">
            {device ? (
                <>
                    {version && (
                        <div id="version" className="text-lime-300">
                            {"Version: " + version}
                        </div>
                    )}

                    {colorMap && (
                        <div id="color-map" className="text-amber-300">
                            <h2>Color Map</h2>
                            {colorMap?.map((x, index) => (
                                <span key={index}>{x},</span>
                            ))}
                        </div>
                    )}

                    {paletteRGBW && (
                        <div id="palette-rgbw" className="text-blue-300">
                            <h2>Palette</h2>
                            {paletteRGBW?.map((x, index) => (
                                <div key={index}>
                                    r:{x.r}, g:{x.g}, b:{x.b}
                                </div>
                            ))}
                        </div>
                    )}

                    <LayoutDefy
                        layer={0}
                        darkMode={true}
                        showUnderglow={true}
                        isStandardView={false}
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
