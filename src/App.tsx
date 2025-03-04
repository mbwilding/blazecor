import "./App.css";
import PageColors from "./pages/PageColors";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/custom/loading";
import DeviceSelector from "@/components/custom/device-selector";
import { useDeviceConnection } from "./Api";
import PageSettings from "./pages/PageSettings";

function App() {
    const { device, version, settings, devices, handleDeviceSelection, fetchDevices } = useDeviceConnection();

    enum AppState {
        DEVICE_SELECTION,
        LOADING_SETTINGS,
        SHOW_COLORS,
        SHOW_SETTINGS,
    }

    let currentState: AppState;

    if (!devices || !device || !settings) {
        currentState = AppState.DEVICE_SELECTION;
    } else if (!settings) {
        currentState = AppState.LOADING_SETTINGS;
        // } else if (settings) {
        //     currentState = AppState.SHOW_SETTINGS;
    } else {
        currentState = AppState.SHOW_COLORS;
    }

    return (
        <>
            <main>
                {currentState === AppState.DEVICE_SELECTION && (
                    <DeviceSelector devices={devices} handleDeviceSelection={handleDeviceSelection} fetchDevices={fetchDevices} />
                )}
                {currentState === AppState.LOADING_SETTINGS && <Loading message="Loading settings" />}
                {false && currentState === AppState.SHOW_SETTINGS && <PageSettings settings={settings!} />}
                {currentState === AppState.SHOW_COLORS && <PageColors device={device!} settings={settings!} />}
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
