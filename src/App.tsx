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
            {device && settings ? (
                <PageColors settings={settings} />
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
