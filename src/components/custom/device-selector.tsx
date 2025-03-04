import { Device } from "@/types/ffi/hardware";
import { useEffect } from "node_modules/react-resizable-panels/dist/declarations/src/vendor/react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";

interface DeviceConnectionProps {
    devices?: Device[];
    handleDeviceSelection: (device: Device) => void;
    fetchDevices: () => void;
}

const DeviceSelector: React.FC<DeviceConnectionProps> = ({ devices, handleDeviceSelection, fetchDevices }) => {
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
                    <DialogDescription>Please select a device or refresh</DialogDescription>
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

export default DeviceSelector;
