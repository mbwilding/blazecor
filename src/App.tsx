import "./App.css";
import { useState, useEffect, useCallback } from "react";
import PageColors from "./pages/pageColors";
import { Device } from "./types/ffi/hardware"; // Assuming Device is properly defined in this path
import { Button } from "@/components/ui/button";
import { useConnect, useDevices, useSettings, useVersion } from "./Api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";

// TODO: Move
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

function DeviceConnection({
    devices,
    handleDeviceSelection,
    fetchDevices,
}: DeviceConnectionProps) {
    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    return (
        <Dialog open>
            <DialogContent className="w-[250px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Select a Device</DialogTitle>
                        <Button variant="secondary" onClick={fetchDevices}>
                            <RefreshCcw />
                        </Button>
                    </div>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                    {devices?.map((device, index) => (
                        <Button
                            key={index}
                            variant="default"
                            onClick={() => handleDeviceSelection(device)}
                        >
                            {device.hardware.info.displayName}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function App() {
    const { device, version, settings, devices, handleDeviceSelection, fetchDevices } = useDeviceConnection(false);

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
