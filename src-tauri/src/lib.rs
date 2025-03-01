// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use dygma_focus::prelude::*;
use tauri::Result;

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
async fn devices() -> Result<Vec<Device>> {
    println!("Devices");
    let devices = Focus::find_all_devices()?;
    Ok(devices)
}

#[tauri::command]
async fn version() -> Result<String> {
    println!("Version");
    let mut focus = Focus::new_first_available()?;
    let version = focus.version().await?;
    Ok(version)
}

#[tauri::command]
async fn settings_get() -> Result<Settings> {
    println!("Settings Get");
    let mut focus = Focus::new_first_available()?;
    let result = focus.settings_get().await?;
    Ok(result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![devices, version, settings_get])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
