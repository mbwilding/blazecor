import "./App.css";
import { useState, useEffect, useCallback } from "react";
import PageColors from "./pages/pageColors";
import { Device } from "./types/ffi/hardware";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/custom/loading";
import DeviceSelector from "@/components/custom/device-selector";
import { useConnect, useDevices, useSettingsGet, useVersion } from "./Api";

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

function App() {
    const { device, version, settings, devices, handleDeviceSelection, fetchDevices } = useDeviceConnection();

    enum AppState {
        DEVICE_SELECTION,
        LOADING_SETTINGS,
        SHOW_PAGE,
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
                    <DeviceSelector
                        devices={devices}
                        handleDeviceSelection={handleDeviceSelection}
                        fetchDevices={fetchDevices}
                    />
                )}
                {currentState === AppState.LOADING_SETTINGS && <Loading message="Loading settings" />}
                {currentState === AppState.SHOW_PAGE && <PageColors device={device!} settings={settings!} />}
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
