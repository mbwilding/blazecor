export type DygmaDeviceInfoType = {
  vendor: "Dygma";
  product: "Raise" | "Defy" | "Raise2";
  keyboardType: string;
  displayName: string;
  urls: {
    name: string;
    url: string;
  }[];
};

export type DygmaDeviceType = {
  info: DygmaDeviceInfoType;
  usb: {
    vendorId: number;
    productId: number;
  };
  keyboard?: {
    rows: number;
    columns: number;
    left: number[][];
    right: number[][];
    ledsLeft: number[];
    ledsRight: number[];
  };
  keyboardUnderglow?: {
    rows: number;
    columns: number;
    ledsLeft: number[];
    ledsRight: number[];
  };
  RGBWMode?: boolean;
  components?: {
    keymap: unknown;
  };
  instructions: {
    en: {
      updateInstructions: string;
    };
  };
  chipId?: string;
  wireless?: boolean;
  bootloader?: boolean;
  path?: string;
  filePath?: string;
  isDeviceSupported?: (port: string) => any;
  flash?: (
    filename: any,
    flash: { updateFirmware: (arg0: any, arg1: any) => any },
    stateUpdate: any,
    bootloader?: boolean,
  ) => any;
};
