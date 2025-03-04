import { Device } from "@/types/ffi/hardware";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { Label } from "../ui/label";

interface DeviceConnectionProps {
    devices?: Device[];
    handleDeviceSelection: (device: Device) => void;
    fetchDevices: () => void;
}

const DeviceSelector: React.FC<DeviceConnectionProps> = ({ devices, handleDeviceSelection, fetchDevices }) => {
    return (
        <Dialog open>
            <DialogContent className="w-[260px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>Devices</DialogTitle>
                        <Button variant="outline" onClick={fetchDevices}>
                            <RefreshCcw />
                        </Button>
                    </div>
                    <DialogDescription>Please select a device or refresh</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col space-y-2">
                    {devices && devices.length > 0 ? (
                        devices.map((device, index) => (
                            <Button key={index} variant="default" onClick={() => handleDeviceSelection(device)}>
                                {device.hardware.info.displayName}
                            </Button>
                        ))
                    ) : (
                        <Label className="justify-center">No devices found</Label>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DeviceSelector;
