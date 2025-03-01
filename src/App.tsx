import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/ui/button";
// import { Input } from "./components/ui/input";
import { LayoutDefy } from "./components/dygma/layouts/defy";
import { Device } from "./types/ffi/hardware";
import { Settings } from "./types/ffi/settings";

// TODO: Move
document.documentElement.classList.add("dark");

function App() {
    const [devices, setDevices] = useState<Device[]>();
    const [device, setDevice] = useState<Device>();
    const [version, setVersion] = useState<string>();
    const [settings, setSettings] = useState<Settings>();

    function resetState() {
        setDevices(undefined);
        setDevice(undefined);
        setVersion(undefined);
        setSettings(undefined);
    }

    async function invokeWithPort<T>(call: string, args?: InvokeArgs): Promise<T> {
        if (device) {
            const port = device.serialPort;
            return await invoke<T>(call, { port, args });
        } else {
            resetState();
            throw new Error("Cannot contact device");
        }
    }

    // useEffect(() => {
    //     resetState();
    // }, [device]);

    async function callDevices() {
        const devices = await invoke<Device[]>("devices");
        setDevices(devices);
        setDevice(devices[0])
    }

    async function callVersion() {
        setVersion(await invokeWithPort("version"));
    }

    async function callSettingsGet() {
        setSettings(await invokeWithPort("settings_get"));
    }

    return (
        <main className="container">
            {device ? (
                <>
                    <form
                        className="row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            callVersion();
                        }}
                    >
                        <Button type="submit">{version ? "Version: " + version : "Version"}</Button>
                    </form>

                    <form
                        className="row"
                        onSubmit={(e) => {
                            e.preventDefault();
                            callSettingsGet();
                        }}
                    >
                        <Button type="submit">Settings</Button>
                    </form>
                    <p>{settings?.mouse_speed}</p>

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
                            callDevices();
                        }}
                    >
                        <Button type="submit">Devices</Button>
                    </form>

                    {devices?.map(device => (
                        <Button type="submit" onClick={() => setDevice(device)}>{device.hardware.info.displayName}</Button>
                    ))}
                </>
            )}
        </main>
    );
}


// <form
//     className="row"
//     onSubmit={(e) => {
//         e.preventDefault();
//         greet();
//     }}
// >
//     <Input
//         id="greet-input"
//         onChange={(e) => setName(e.currentTarget.value)}
//         placeholder="Enter a name..."
//     />
//     <Button type="submit">Greet</Button>
// </form>
// <p>{greetMsg}</p>

export default App;
