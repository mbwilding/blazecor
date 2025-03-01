import { useCallback, useEffect, useState } from "react";
import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/ui/button";
import { LayoutDefy } from "./components/dygma/layouts/defy";
import { Device } from "./types/ffi/hardware";
import { Settings } from "./types/ffi/settings";

// TODO: Move
document.documentElement.classList.add("dark");

function useInvokeWithPort(device?: Device) {
    return async function <T>(call: string, args?: InvokeArgs): Promise<T> {
        if (device) {
            const port = device.serialPort;
            return await invoke<T>(call, { port, args });
        } else {
            throw new Error("Cannot contact device");
        }
    };
}

function useCommand(command: string, device?: Device, onExecute?: () => void) {
    const invokeWithPort = useInvokeWithPort(device);

    useEffect(() => {
        const executeCommand = async () => {
            try {
                await invokeWithPort(command);
                if (onExecute) onExecute();
            } catch (error) {
                console.error(error);
            }
        };

        if (device) {
            executeCommand();
        }
    }, [device, command]);
}

function useDevices() {
    const [devices, setDevices] = useState<Device[]>();

    const fetchDevices = useCallback(async () => {
        try {
            const result = await invoke<Device[]>("find_all_devices");
            setDevices(result);
        } catch (error) {
            console.error(error);
            setDevices(undefined);
        }
    }, []);

    return { devices, fetchDevices };
}

function useConnect(device?: Device) {
    useCommand("connect", device, () => {
        if (device) {
            console.debug(`Connecting: ${device.hardware.info.displayName} (${device.serialPort})`);
        }
    });
}

function useDeviceData<T>(command: string, device?: Device): T | undefined {
    const [data, setData] = useState<T>();
    const invokeWithPort = useInvokeWithPort(device);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await invokeWithPort<T>(command);
                console.debug(`${command}: ${JSON.stringify(result)}`);
                setData(result);
            } catch (error) {
                console.error(error);
                setData(undefined);
            }
        };

        if (device) {
            fetchData();
        } else {
            setData(undefined);
        }
    }, [device, command]);

    return data;
}

function useVersion(device?: Device) {
    return useDeviceData<string>("version", device);
}

function useSettings(device?: Device) {
    return useDeviceData<Settings>("settings_get", device);
}

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
