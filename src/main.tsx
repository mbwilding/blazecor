import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";

function forwardConsole(fnName: "log" | "debug" | "info" | "warn" | "error", rust: (message: string) => Promise<void>) {
    const java = console[fnName];
    console[fnName] = message => {
        java(message);
        rust(message);
    };
}

forwardConsole("log", trace);
forwardConsole("debug", debug);
forwardConsole("info", info);
forwardConsole("warn", warn);
forwardConsole("error", error);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
