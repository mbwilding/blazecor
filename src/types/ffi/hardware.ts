export interface Device {
  hardware: Hardware;
  serialPort: string;
}

export interface Hardware {
  info: Info;
  usb: Usb;
  bootloader: boolean;
  keyboard?: Grid;
  keyboardUnderglow?: Grid;
  rgbwMode: boolean;
  wireless: boolean;
  instructions: Languages;
  virtualInfo?: Virtual;
}

export interface Virtual {
  version: VirtualNode;
  keymapCustom: VirtualNode;
  keymapDefault: VirtualNode;
  keymapOnlyCustom: VirtualNode;
  settingsDefaultLayer: VirtualNode;
  settingsValid: VirtualNode;
  settingsVersion: VirtualNode;
  settingsCrc: VirtualNode;
  eepromContents: VirtualNode;
  eepromFree: VirtualNode;
  ledAt: VirtualNode;
  ledSetAll: VirtualNode;
  ledMode: VirtualNode;
  ledFade?: VirtualNode;
  ledBrightness: VirtualNode;
  ledBrightnessWireless?: VirtualNode;
  ledBrightnessUg: VirtualNode;
  ledBrightnessUgWireless?: VirtualNode;
  ledTheme: VirtualNode;
  palette: VirtualNode;
  colormapMap: VirtualNode;
  idleLedsTimeLimit: VirtualNode;
  idleLedsWireless?: VirtualNode;
  hardwareVersion: VirtualNode;
  hardwareSidePower: VirtualNode;
  hardwareSideVer: VirtualNode;
  hardwareSledVer: VirtualNode;
  hardwareSledCurrent: VirtualNode;
  hardwareLayout: VirtualNode;
  hardwareJoint: VirtualNode;
  hardwareKeyscan: VirtualNode;
  hardwareCrcErrors: VirtualNode;
  hardwareFirmware: VirtualNode;
  hardwareChipId: VirtualNode;
  qukeysHoldTimeout: VirtualNode;
  qukeysOverlapThreshold: VirtualNode;
  superkeysMap: VirtualNode;
  superkeysWaitFor: VirtualNode;
  superkeysTimeout: VirtualNode;
  superkeysRepeat: VirtualNode;
  superkeysHoldStart: VirtualNode;
  superkeysOverlap: VirtualNode;
  macrosMap: VirtualNode;
  macrosTrigger: VirtualNode;
  macrosMemory: VirtualNode;
  help: VirtualNode;
  mouseSpeed: VirtualNode;
  mouseSpeedDelay: VirtualNode;
  mouseAccelSpeed: VirtualNode;
  mouseAccelDelay: VirtualNode;
  mouseWheelSpeed: VirtualNode;
  mouseWheelDelay: VirtualNode;
  mouseSpeedLimit: VirtualNode;
  layerActivate: VirtualNode;
  layerDeactivate: VirtualNode;
  layerIsActive: VirtualNode;
  layerMoveTo: VirtualNode;
  layerState: VirtualNode;
  wirelessBatteryLeftLevel?: VirtualNode;
  wirelessBatteryRightLevel?: VirtualNode;
  wirelessBatteryLeftStatus?: VirtualNode;
  wirelessBatteryRightStatus?: VirtualNode;
  wirelessBatterySavingMode?: VirtualNode;
  wirelessEnergyModes?: VirtualNode;
  wirelessEnergyDisable?: VirtualNode;
  wirelessEnergyCurrentMode?: VirtualNode;
  wirelessBluetoothMacs?: VirtualNode;
  wirelessBluetoothPeerIds?: VirtualNode;
  wirelessBluetoothRemove?: VirtualNode;
  wirelessBluetoothDeviceName?: VirtualNode;
  wirelessBluetoothList?: VirtualNode;
  wirelessRfPower?: VirtualNode;
  wirelessRfStability?: VirtualNode;
  wirelessRfChannelHop?: VirtualNode;
  wirelessRfSyncPairing?: VirtualNode;
}

export interface VirtualNode {
  data: string;
  erasable: boolean;
}

export interface Info {
  vendor: Vendor;
  product: Product;
  keyboardType: DeviceType;
  displayName: string;
  urls: Urls;
}

export interface Urls {
  homepage: Url;
}

export interface Url {
  name: string;
  url: string;
}

export enum Vendor {
  Dygma = "Dygma",
}

export enum Product {
  Defy = "Defy",
  Raise = "Raise",
  Raise2 = "Raise 2",
}

export enum DeviceType {
  Wired = "Wired",
  Wireless = "Wireless",
  ISO = "ISO",
  ANSI = "ANSI",
}

export interface Usb {
  vendorId: number;
  productId: number;
}

export interface Grid {
  rows: number;
  columns: number;
}

export interface Languages {
  en: Dialog;
}

export interface Dialog {
  updateInstructions: string;
}
