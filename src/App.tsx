import "./App.css";
import { useState, useEffect, useCallback } from "react";
import PageColors from "./pages/pageColors";
import { Device } from "./types/ffi/hardware"; // Assuming Device is properly defined in this path
import { Button } from "@/components/ui/button";
import { useConnect, useDevices, useSettings, useVersion } from "./Api";

document.documentElement.classList.add("dark");

function useDeviceConnection(quickConnect: boolean) {
    const [device, setDevice] = useState<Device>();
    const { devices, fetchDevices } = useDevices();

    useConnect(device);

    const version = useVersion(device);
    const settings = useSettings(device);

    const handleDeviceSelection = useCallback((device: Device) => {
        setDevice(device);
    }, []);

    useEffect(() => {
        if (quickConnect && !devices) {
            fetchDevices();
        }
    }, [quickConnect, devices, fetchDevices]);

    useEffect(() => {
        if (quickConnect && devices?.length && !device) {
            setDevice(devices[0]);
        }
    }, [quickConnect, devices, device]);

    return { device, version, settings, devices, handleDeviceSelection, fetchDevices };
}

interface DeviceConnectionProps {
    devices?: Device[];
    handleDeviceSelection: (device: Device) => void;
    fetchDevices: () => void;
}

function DeviceConnection({ devices, handleDeviceSelection, fetchDevices }: DeviceConnectionProps) {
    return (
        <div className="container flex flex-col justify-center items-center">
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
                <Button key={index} type="button" onClick={() => handleDeviceSelection(device)}>
                    {device.hardware.info.displayName}
                </Button>
            ))}
        </div>
    );
}

function App() {
    const { device, version, settings, devices, handleDeviceSelection, fetchDevices } = useDeviceConnection(true);

    return (
        <main className="container">
            {device && version && settings ? (
                <PageColors settings={settings} />
            ) : (
                <DeviceConnection devices={devices} handleDeviceSelection={handleDeviceSelection} fetchDevices={fetchDevices} />
            )}
        </main>
    );
}

export default App;
