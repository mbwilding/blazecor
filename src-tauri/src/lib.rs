// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use anyhow::anyhow;
use dygma_focus::prelude::*;
use std::sync::Mutex;
use tauri::{Result, State};

struct Storage {
    focus: Mutex<Option<Focus>>,
}

#[tauri::command]
fn find_all_devices() -> Result<Vec<Device>> {
    Ok(Focus::find_all_devices()?)
}

#[tauri::command]
fn connect(port: &str, storage: State<Storage>) -> Result<()> {
    *storage.focus.lock().unwrap() = Some(Focus::new_via_port(port)?);
    Ok(())
}

#[tauri::command]
fn disconnect(storage: State<Storage>) {
    *storage.focus.lock().unwrap() = None;
}

fn with_focus<T, F>(storage: State<Storage>, func: F) -> Result<T>
where
    F: FnOnce(&mut Focus) -> Result<T>,
{
    let mut focus_guard = storage.focus.lock().unwrap();
    let focus = focus_guard
        .as_mut()
        .ok_or_else(|| anyhow!("Not connected"))?;
    match func(focus) {
        Ok(result) => Ok(result),
        Err(err) => {
            *focus_guard = None;
            Err(err)
        }
    }
}

#[tauri::command]
fn version(storage: State<Storage>) -> Result<String> {
    with_focus(storage, |focus| Ok(focus.version()?))
}

#[tauri::command]
fn settings_get(storage: State<Storage>) -> Result<Settings> {
    with_focus(storage, |focus| Ok(focus.settings_get()?))
}

#[tauri::command]
fn palette_rgbw_get(storage: State<Storage>) -> Result<Vec<RGBW>> {
    with_focus(storage, |focus| Ok(focus.palette_rgbw_get()?))
}

#[tauri::command]
fn color_map_get(storage: State<Storage>) -> Result<Vec<u8>> {
    with_focus(storage, |focus| Ok(focus.color_map_get()?))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .manage(Storage {
            focus: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            find_all_devices,
            connect,
            disconnect,
            version,
            settings_get,
            palette_rgbw_get,
            color_map_get
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
