// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::Result;
use dygma_focus::prelude::*;

// #[tauri::command]
// fn greet(name: &str) -> String {
//     format!("Hello, {}! You've been greeted from Rust!", name)
// }

#[tauri::command]
async fn devices() -> Result<String> {
    let devices = Focus::find_all_devices()?;
    Ok(serde_json::to_string(&devices)?)
}

// #[tauri::command]
// async fn version() -> Result<String> {
//     let mut focus = Focus::new_first_available()?;
//     let version = focus.version().await?;
//     Ok(version)
// }

// #[tauri::command]
// async fn settings_get() -> Result<String> {
//     let mut focus = Focus::new_first_available()?;
//     let settings = focus.settings_get().await?;
//     Ok(serde_json::to_string(&settings)?)
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        // .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![devices])
        // .invoke_handler(tauri::generate_handler![version])
        // .invoke_handler(tauri::generate_handler![settings_get])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
