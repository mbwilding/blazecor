import "./App.css";
import { Button } from "./components/ui/button";
import { Device } from "./types/ffi/hardware";
import { useConnect, useDevices, useSettings, useVersion } from "./Api";
import { useState, useEffect } from "react";
import PageColors from "./components/pages/pageColors";

// TODO: Move these
document.documentElement.classList.add("dark");
const quickConnect = true;

function App() {
    const [device, setDevice] = useState<Device>();
    const { devices, fetchDevices } = useDevices();

    useConnect(device);

    const version = useVersion(device);
    const settings = useSettings(device);

    useEffect(() => {
        if (quickConnect && !devices) {
            fetchDevices();
        }
    }, [quickConnect, devices, fetchDevices]);

    useEffect(() => {
        if (quickConnect && devices && devices.length > 0 && !device) {
            setDevice(devices[0]);
        }
    }, [quickConnect, devices, device]);

    return (
        <main className="container">
            {device && settings ? (
                <PageColors settings={settings} />
            ) : (
                !quickConnect && (
                    <>
                        <form
                            className="row"
                            onSubmit={e => {
                                e.preventDefault();
                                fetchDevices();
                            }}
                        >
                            <Button type="submit">Devices</Button>
                        </form>

                        {devices?.map((device, index) => (
                            <Button key={index} type="button" onClick={() => setDevice(device)}>
                                {device.hardware.info.displayName}
                            </Button>
                        ))}
                    </>
                )
            )}
        </main>
    );
}

export default App;
