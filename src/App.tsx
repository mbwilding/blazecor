import { useState } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/ui/button";
// import { Input } from "./components/ui/input";
import { LayoutDefy } from "./components/dygma/layouts/defy";
import { Device } from "./types/ffi/hardware";

// TODO: Move
document.documentElement.classList.add("dark");

function App() {
    // const [greetMsg, setGreetMsg] = useState("");
    const [devices, setDevices] = useState<Device[]>();
    const [version, setVersion] = useState<string>();
    const [settings, setSettings] = useState<string>();

    // async function greet() {
    //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //     setGreetMsg(await invoke("greet", { name }));
    // }

    async function callDevices() {
        setDevices(await invoke("devices"))
    }

    async function callVersion() {
        setVersion(await invoke("version"));
    }

    async function callSettingsGet() {
        setSettings(await invoke("settings_get"));
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
              <p>{device.serialPort}</p>
            ))}

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

            <LayoutDefy layer={0} darkMode={true} showUnderglow={true} isStandardView={false} onKeySelect={(e) => console.log(e)} />
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
