import { Button } from "@/components/ui/button";
import { Device } from "@/types/ffi/hardware";
import { Settings } from "@/types/ffi/settings";
import { useConnect, useDevices, useSettings, useVersion } from "../Api";
import { useState, useEffect, useCallback } from "react";

export interface PagePreConnectProps {
    quickConnect: boolean;
    onConnect?: (version: string, settings: Settings) => void;
}

export default function PagePreConnect({ quickConnect, onConnect }: PagePreConnectProps) {
    const [selectedDevice, setSelectedDevice] = useState<Device>();
    const { devices, fetchDevices } = useDevices();

    const handleDeviceSelection = useCallback((device: Device) => {
        setSelectedDevice(device);
    }, []);

    useConnect(selectedDevice);

    const version = useVersion(selectedDevice);
    const settings = useSettings(selectedDevice);

    useEffect(() => {
        if (quickConnect && !devices) {
            fetchDevices();
        }
    }, [quickConnect, devices, fetchDevices]);

    useEffect(() => {
        if (quickConnect && devices?.length && !selectedDevice) {
            setSelectedDevice(devices[0]);
        }
    }, [quickConnect, devices, selectedDevice]);

    useEffect(() => {
        if (version && settings && onConnect) {
            onConnect(version, settings);
        }
    }, [version, settings, onConnect]);

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
