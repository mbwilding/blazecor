import { useState } from "react";
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

    async function invokeWithPort<T>(call: string, args?: InvokeArgs): Promise<T> {
        if (device) {
            const port = device.serialPort;
            return await invoke<T>(call, { port, args });
        } else {
            throw new Error("Device is undefined");
        }
    }

    async function callDevices() {
        setDevices(await invoke("devices"))
    }

    async function callVersion() {
        setVersion(await invokeWithPort("version"));
    }

    async function callSettingsGet() {
        setSettings(await invokeWithPort("settings_get"));
    }

    return (
        <main className="container">
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
                    <p>{settings}</p>

                    <LayoutDefy
                        layer={0}
                        darkMode={true}
                        showUnderglow={true}
                        isStandardView={false}
                        onKeySelect={(e) => console.log(e)}
                    />
                </>
            ) : (
                <div>No device connected</div>
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
