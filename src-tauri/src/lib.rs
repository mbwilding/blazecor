// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use dygma_focus::prelude::*;
use tauri::Result;

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
async fn devices() -> Result<Vec<Device>> {
    Ok(Focus::find_all_devices()?)
}

#[tauri::command]
async fn version(port: &str) -> Result<String> {
    let mut focus = Focus::new_via_port(port)?;
    let version = focus.version().await?;
    Ok(version)
}

#[tauri::command]
async fn settings_get(port: &str) -> Result<Settings> {
    let mut focus = Focus::new_via_port(port)?;
    Ok(focus.settings_get().await?)
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
