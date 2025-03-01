// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use dygma_focus::prelude::*;
use tauri::Result;

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
fn find_all_devices() -> Result<Vec<Device>> {
    Ok(Focus::find_all_devices()?)
}

#[tauri::command]
async fn version(port: &str) -> Result<String> {
    let mut focus = Focus::new_via_port(port)?;
    Ok(focus.version().await?)
}

#[tauri::command]
async fn settings_get(port: &str) -> Result<Settings> {
    let mut focus = Focus::new_via_port(port)?;
    Ok(focus.settings_get().await?)
}

#[tauri::command]
async fn palette_rgbw_get(port: &str) -> Result<Vec<RGBW>> {
    Ok(Focus::new_via_port(port)?.palette_rgbw_get().await?)
}

#[tauri::command]
async fn color_map_get(port: &str) -> Result<Vec<u8>> {
    Ok(Focus::new_via_port(port)?.color_map_get().await?)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            find_all_devices,
            version,
            settings_get,
            palette_rgbw_get,
            color_map_get
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
