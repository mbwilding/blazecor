export interface Settings {
  keymapCustom: number[]; // Vec<u16>
  keymapDefault: number[]; // Vec<u16>
  keymapOnlyCustom: boolean;
  settingsDefaultlayer: number; // u8
  superkeysMap: number[]; // Vec<u16>
  superkeysWaitFor: number; // Duration
  superkeysTimeout: number; // Duration
  superkeysRepeat: number; // Duration
  superkeysHoldStart: number; // Duration
  superkeysOverlap: number; // u8
  ledMode: LedMode;
  ledBrightnessKeysWired: number; // u8
  ledBrightnessUnderglowWired?: number; // Option<u8>
  ledBrightnessKeysWireless?: number; // Option<u8>
  ledBrightnessUnderglowWireless?: number; // Option<u8>
  ledFade?: number; // Option<u16>
  ledTheme: Color[];
  paletteRgb?: Color[];
  paletteRgbw?: Color[];
  colorMap: number[]; // Vec<u8>
  ledIdleTrueSleep?: boolean; // Option<bool>
  ledIdleTrueSleepTime?: number; // Option<Duration>
  ledIdleTimeLimitWired: number; // Duration
  ledIdleTimeLimitWireless?: number; // Option<Duration>
  qukeysHoldTimeout: number; // Duration
  qukeysOverlapThreshold: number; // Duration
  macrosMap: number[]; // Vec<u8>
  mouseSpeed: number; // u8
  mouseDelay: number; // Duration
  mouseAccelerationSpeed: number; // u8
  mouseAccelerationDelay: number; // Duration
  mouseWheelSpeed: number; // u8
  mouseWheelDelay: number; // Duration
  mouseSpeedLimit: number; // u8
  wirelessBatterySavingMode?: boolean; // Option<bool>
  wirelessRfPowerLevel?: WirelessPowerMode; // Option<WirelessPowerMode>
  wirelessRfChannelHop?: boolean; // Option<bool>
}

export enum LedMode {
  /** The default mode. The LEDs will be set to the color of the layer you are on. */
  Static = 0,
  /** Rainbow effect. */
  Rainbow = 1,
  /** Cycle colors. */
  Cycle = 2,
  /** All LEDs will be off until pressed, they will light up when pressed and cycle colors back to off. */
  Stalker = 3,
  /** All LEDs to red. */
  Red = 4,
  /** All LEDs to green. */
  Green = 5,
  /** All LEDs to blue. */
  Blue = 6,
  /** All LEDs to white. */
  White = 7,
  /** All LEDs to off. */
  Off = 8,
  /** The inner three LEDs on both sides will be green, the rest will be off. */
  Debug = 9,
  /** Emulates the bluetooth connect sequence. */
  Bluetooth = 10,
}

/** The wireless power mode states. */
export enum WirelessPowerMode {
  /** Low power mode. The battery will last longer but the wireless range will be shorter. */
  Low = 0,
  /** Medium power mode. The battery will last a bit less but the wireless range will be longer. */
  Medium = 1,
  /** High power mode. The battery will last the least but the wireless range will be the longest. */
  High = 2,
}

/** The device side. */
export enum Side {
  Right = 0,
  Left = 1,
}

/** The LED color. */
export interface Color {
  /** Red component of the color. */
  r: number;
  /** Green component of the color. */
  g: number;
  /** Blue component of the color. */
  b: number;
  /** Optional white component of the color. */
  w?: number;
}
