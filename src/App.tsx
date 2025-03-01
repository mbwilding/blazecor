import { useState } from "react";
// import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import { Button } from "./components/ui/button";
// import { Input } from "./components/ui/input";
import { LayoutDefy } from "./components/dygma/layouts/defy";

// TODO: Move
document.documentElement.classList.add("dark");

function App() {
    // const [greetMsg, setGreetMsg] = useState("");
    const [versionMsg, setVersionMsg] = useState("");
    const [settingsMsg, setSettingsMsg] = useState("");

    // async function greet() {
    //     // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    //     setGreetMsg(await invoke("greet", { name }));
    // }

    async function version() {
        setVersionMsg(await invoke("version"));
    }

    async function settingsGet() {
        setSettingsMsg(await invoke("settings_get"));
    }

    return (
        <main className="container">

            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    version();
                }}
            >
                <Button type="submit">{versionMsg ? "Version: " + versionMsg : "Version"}</Button>
            </form>

            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    settingsGet();
                }}
            >
                <Button type="submit">Settings</Button>
            </form>
            <p>{settingsMsg}</p>

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
