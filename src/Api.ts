import { Device } from "./types/ffi/hardware";
import { Settings } from "./types/ffi/settings";
import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";

// Helpers

function useInvoke(device?: Device) {
    return async function <T>(call: string, args?: InvokeArgs): Promise<T> {
        if (device) {
            const port = device.serialPort;
            return await invoke<T>(call, { port, args });
        } else {
            throw new Error("Cannot contact device");
        }
    };
}

function useFocus(command: string, device?: Device, onExecute?: () => void) {
    const invoke = useInvoke(device);

    useEffect(() => {
        const executeCommand = async () => {
            try {
                await invoke(command);
                if (onExecute) onExecute();
            } catch (error) {
                console.error(error);
            }
        };

        if (device) {
            executeCommand();
        }
    }, [device, command]);
}

function useFocusData<T>(command: string, device?: Device): T | undefined {
    const [data, setData] = useState<T>();
    const invoke = useInvoke(device);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await invoke<T>(command);
                setData(result);
            } catch (error: any) {
                console.error(error);
                setData(undefined);
            }
        };

        if (device) {
            fetchData();
        } else {
            setData(undefined);
        }
    }, [device, command]);

    return data;
}

// API Exports

export function useDevices() {
    const [devices, setDevices] = useState<Device[]>();

    const fetchDevices = useCallback(async () => {
        try {
            const devices = await invoke<Device[]>("find_all_devices");
            setDevices(devices);
        } catch (error: any) {
            console.error(error);
            setDevices(undefined);
        }
    }, []);

    return { devices, fetchDevices };
}

export function useConnect(device?: Device) {
    useFocus("connect", device, () => {
        if (device) {
            console.debug(`Connecting: ${device.hardware.info.displayName} (${device.serialPort})`);
        }
    });
}

export function useVersion(device?: Device) {
    return useFocusData<string>("version", device);
}

export function useSettings(device?: Device) {
    return useFocusData<Settings>("settings_get", device);
}
