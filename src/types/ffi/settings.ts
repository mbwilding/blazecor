export interface Settings {
    keymap_custom: number[]; // Vec<u16>
    keymap_default: number[]; // Vec<u16>
    keymap_only_custom: boolean;
    settings_default_layer: number; // u8
    superkeys_map: number[]; // Vec<u16>
    superkeys_wait_for: number; // Duration
    superkeys_timeout: number; // Duration
    superkeys_repeat: number; // Duration
    superkeys_hold_start: number; // Duration
    superkeys_overlap: number; // u8
    led_mode: LedMode;
    led_brightness_keys_wired: number; // u8
    led_brightness_underglow_wired?: number; // Option<u8>
    led_brightness_keys_wireless?: number; // Option<u8>
    led_brightness_underglow_wireless?: number; // Option<u8>
    led_fade?: number; // Option<u16>
    led_theme: RGB[];
    palette_rgb?: RGB[];
    palette_rgbw?: RGBW[];
    color_map: number[]; // Vec<u8>
    led_idle_true_sleep?: boolean; // Option<bool>
    led_idle_true_sleep_time?: number; // Option<Duration>
    led_idle_time_limit_wired: number; // Duration
    led_idle_time_limit_wireless?: number; // Option<Duration>
    qukeys_hold_timeout: number; // Duration
    qukeys_overlap_threshold: number; // Duration
    macros_map: number[]; // Vec<u8>
    mouse_speed: number; // u8
    mouse_delay: number; // Duration
    mouse_acceleration_speed: number; // u8
    mouse_acceleration_delay: number; // Duration
    mouse_wheel_speed: number; // u8
    mouse_wheel_delay: number; // Duration
    mouse_speed_limit: number; // u8
    wireless_battery_saving_mode?: boolean; // Option<bool>
    wireless_rf_power_level?: WirelessPowerMode; // Option<WirelessPowerMode>
    wireless_rf_channel_hop?: boolean; // Option<bool>
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

export interface RGB {
    /** Red component of the color. */
    r: number;
    /** Green component of the color. */
    g: number;
    /** Blue component of the color. */
    b: number;
}

/** The LED RGBW color. */
export interface RGBW {
    /** Red component of the color. */
    r: number;
    /** Green component of the color. */
    g: number;
    /** Blue component of the color. */
    b: number;
    /** White component of the color. */
    w: number;
}
