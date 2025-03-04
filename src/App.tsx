import "./App.css";
import { useState, useEffect, useCallback } from "react";
import PageColors from "./pages/pageColors";
import { Device } from "./types/ffi/hardware";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "@/components/custom/loading";
import { useConnect, useDevices, useSettingsGet, useVersion } from "./Api";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RefreshCcw } from "lucide-react";

function useDeviceConnection() {
    const [device, setDevice] = useState<Device>();
    const { devices, fetchDevices } = useDevices();

    useConnect(device);

    const version = useVersion(device);
    const settings = useSettingsGet(device);

    const handleDeviceSelection = useCallback((device: Device) => {
        setDevice(device);
    }, []);

    useEffect(() => {
        if (!devices) {
            fetchDevices();
        }
    }, [devices, fetchDevices]);

    useEffect(() => {
        if (devices?.length === 1 && !device) {
            setDevice(devices[0]);
        }
    }, [devices, device]);

    return { device, version, settings, devices, handleDeviceSelection, fetchDevices };
}

interface DeviceConnectionProps {
    devices?: Device[];
    handleDeviceSelection: (device: Device) => void;
    fetchDevices: () => void;
}

function DeviceConnection({ devices, handleDeviceSelection, fetchDevices }: DeviceConnectionProps) {
    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);

    return (
        <Dialog open>
            <DialogContent className="w-[260px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Devices</DialogTitle>
                        <Button variant="secondary" onClick={fetchDevices}>
                            <RefreshCcw />
                        </Button>
                    </div>
                    <DialogDescription>
                        Please select a device or refresh
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                    {devices?.map((device, index) => (
                        <Button key={index} variant="default" onClick={() => handleDeviceSelection(device)}>
                            {device.hardware.info.displayName}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function App() {
    const { device, version, settings, devices, handleDeviceSelection, fetchDevices } = useDeviceConnection();

    enum AppState {
        DEVICE_SELECTION,
        LOADING_SETTINGS,
        SHOW_PAGE
    }

    let currentState: AppState;

    if (!devices || !device || !settings) {
        currentState = AppState.DEVICE_SELECTION;
    } else if (!settings) {
        currentState = AppState.LOADING_SETTINGS;
    } else {
        currentState = AppState.SHOW_PAGE;
    }

    return (
        <>
            <main>
                {currentState === AppState.DEVICE_SELECTION && (
                    <DeviceConnection
                        devices={devices}
                        handleDeviceSelection={handleDeviceSelection}
                        fetchDevices={fetchDevices}
                    />
                )}
                {currentState === AppState.LOADING_SETTINGS && <Loading message="Loading settings" />}
                {currentState === AppState.SHOW_PAGE && (
                    <PageColors device={device!} settings={settings!} />
                )}
            </main>

            {version && (
                <div className="fixed bottom-4 right-4 z-50">
                    <Badge>{`Firmware: ${version}`}</Badge>
                </div>
            )}
        </>
    );
}

export default App;
