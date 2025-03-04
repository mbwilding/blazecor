// TODO: All settings

import { LedMode, Settings, WirelessPowerMode } from "@/types/ffi/settings";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export interface DeviceSettingsProps {
    settings: Settings;
}

const DeviceSettings: React.FC<DeviceSettingsProps> = ({ settings }) => {
    return (
        <Accordion type="multiple">
            {/* Keymap Settings */}
            <AccordionItem value="keymap">
                <AccordionTrigger>Keymap Settings</AccordionTrigger>
                <AccordionContent>
                    {/* keymapCustom */}
                    <div>
                        <label>Custom Keymap</label>
                        <Input value={settings.keymapCustom.join(",")} />
                    </div>
                    {/* keymapDefault */}
                    <div>
                        <label>Default Keymap</label>
                        <Input value={settings.keymapDefault.join(",")} />
                    </div>
                    {/* keymapOnlyCustom */}
                    <div>
                        <label>Use Only Custom Keymap</label>
                        <Switch checked={settings.keymapOnlyCustom} />
                    </div>
                    {/* settingsDefaultLayer */}
                    <div>
                        <label>Default Layer</label>
                        <Input type="number" value={settings.settingsDefaultLayer} />
                    </div>
                </AccordionContent>
            </AccordionItem>

            {/* Superkeys Settings */}
            <AccordionItem value="superkeys">
                <AccordionTrigger>Superkeys Settings</AccordionTrigger>
                <AccordionContent>
                    {/* superkeysMap */}
                    <div>
                        <label>Superkeys Map</label>
                        <Input value={settings.superkeysMap.join(",")} />
                    </div>
                    {/* superkeysWaitFor */}
                    <div>
                        <label>Wait For (ms)</label>
                        <Input type="number" value={settings.superkeysWaitFor} />
                    </div>
                    {/* superkeysTimeout */}
                    <div>
                        <label>Timeout (ms)</label>
                        <Input type="number" value={settings.superkeysTimeout} />
                    </div>
                    {/* Additional superkeys settings */}
                    {/* ... */}
                </AccordionContent>
            </AccordionItem>

            {/* LED Settings */}
            <AccordionItem value="led">
                <AccordionTrigger>LED Settings</AccordionTrigger>
                <AccordionContent>
                    {/* ledMode */}
                    <div>
                        <label>LED Mode</label>
                        <Select value={settings.ledMode.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select LED Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(LedMode)
                                    .filter(([key, value]) => typeof value === "number")
                                    .map(([key, value]) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            {key}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* ledBrightnessKeysWired */}
                    <div>
                        <label>LED Brightness (Keys Wired)</label>
                        <Slider value={[settings.ledBrightnessKeysWired]} max={255} />
                    </div>
                    {/* Additional LED settings */}
                    {/* ... */}
                </AccordionContent>
            </AccordionItem>

            {/* Mouse Settings */}
            <AccordionItem value="mouse">
                <AccordionTrigger>Mouse Settings</AccordionTrigger>
                <AccordionContent>
                    {/* mouseSpeed */}
                    <div>
                        <label>Mouse Speed</label>
                        <Input type="number" value={settings.mouseSpeed} />
                    </div>
                    {/* mouseDelay */}
                    <div>
                        <label>Mouse Delay (ms)</label>
                        <Input type="number" value={settings.mouseDelay} />
                    </div>
                    {/* Additional mouse settings */}
                    {/* ... */}
                </AccordionContent>
            </AccordionItem>

            {/* Wireless Settings */}
            <AccordionItem value="wireless">
                <AccordionTrigger>Wireless Settings</AccordionTrigger>
                <AccordionContent>
                    {/* wirelessBatterySavingMode */}
                    <div>
                        <label>Battery Saving Mode</label>
                        <Switch checked={settings.wirelessBatterySavingMode || false} />
                    </div>
                    {/* wirelessRfPowerLevel */}
                    <div>
                        <label>RF Power Level</label>
                        <Select
                            value={settings.wirelessRfPowerLevel !== undefined ? settings.wirelessRfPowerLevel.toString() : ""}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Power Level" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(WirelessPowerMode)
                                    .filter(([key, value]) => typeof value === "number")
                                    .map(([key, value]) => (
                                        <SelectItem key={value} value={value.toString()}>
                                            {key}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Additional wireless settings */}
                    {/* ... */}
                </AccordionContent>
            </AccordionItem>

            {/* Additional settings groups */}
            {/* ... */}
        </Accordion>
    );
};

export default DeviceSettings;
