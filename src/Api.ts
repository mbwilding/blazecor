import { Device } from "./types/ffi/hardware";
import { Settings } from "./types/ffi/settings";
import { invoke, InvokeArgs } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";

// Helpers

function useInvokeGet(device?: Device) {
    return async function <T>(call: string, args?: InvokeArgs): Promise<T> {
        if (device) {
            const port = device.serialPort;
            return await invoke<T>(call, { port, args });
        } else {
            throw new Error("Cannot contact device");
        }
    };
}

function useInvokeSet(device?: Device) {
    return async function (call: string, args: InvokeArgs): Promise<void> {
        if (device) {
            const port = device.serialPort;
            await invoke(call, { port, args });
        } else {
            throw new Error("Cannot contact device");
        }
    };
}

function useFocus(command: string, device?: Device, onExecute?: () => void) {
    const invoke = useInvokeGet(device);

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

function useFocusGet<T>(command: string, device?: Device): T | undefined {
    const [data, setData] = useState<T>();
    const invoke = useInvokeGet(device);

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

function useFocusSet<T>(command: string, device?: Device) {
    const invoke = useInvokeSet(device);

    const setData = useCallback(async (data: T): Promise<void> => {
        if (device) {
            try {
                await invoke(command, { data: data });
            } catch (e) {
                console.error(e);
            }
        }
    }, [device, command]);

    return setData;
}

// API Exports

export function useDevices() {
    const [devices, setDevices] = useState<Device[]>();

    const fetchDevices = useCallback(async () => {
        try {
            const devices = await invoke<Device[]>("find_all_devices");
            setDevices(devices);
        } catch (e) {
            console.error(e);
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

export function useDisconnect(device?: Device) {
    useFocus("diconnect", device, () => {
        if (device) {
            console.debug(`Disconnecting: ${device.hardware.info.displayName} (${device.serialPort})`);
        } else {
            console.warn("Already disconnected");
        }
    });
}

export function useVersion(device?: Device) {
    return useFocusGet<string>("version", device);
}

export function useSettingsGet(device?: Device) {
    return useFocusGet<Settings>("settings_get", device);
}

export function usePaletteSet(rgbw: boolean, device?: Device) {
    return useFocusSet(rgbw ? "palette_rgbw_set" : "palette_rgb_set", device);
}
