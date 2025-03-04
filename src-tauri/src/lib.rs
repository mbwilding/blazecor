// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use anyhow::anyhow;
use dygma_focus::prelude::*;
use log::info;
use std::sync::Mutex;
use tauri::{Result, State};

struct Storage {
    focus: Mutex<Option<Focus>>,
}

#[tauri::command]
fn find_all_devices() -> Result<Vec<Device>> {
    info!("RUST FIND DEVICES");
    Ok(Focus::find_all_devices()?
        .into_iter()
        // For macOS as it will return 2 serial devices per dygma device
        .filter(|device| !device.serial_port.starts_with("/dev/cu."))
        .collect())
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
fn settings_set(data: Settings, storage: State<Storage>) -> Result<()> {
    with_focus(storage, |focus| Ok(focus.settings_set(&data)?))
}

#[tauri::command]
fn palette_rgb_get(storage: State<Storage>) -> Result<Vec<RGB>> {
    with_focus(storage, |focus| Ok(focus.palette_rgb_get()?))
}

#[tauri::command]
fn palette_rgb_set(data: Vec<RGB>, storage: State<Storage>) -> Result<()> {
    with_focus(storage, |focus| Ok(focus.palette_rgb_set(&data)?))
}

#[tauri::command]
fn palette_rgbw_get(storage: State<Storage>) -> Result<Vec<RGBW>> {
    with_focus(storage, |focus| Ok(focus.palette_rgbw_get()?))
}

#[tauri::command]
fn palette_rgbw_set(data: Vec<RGBW>, storage: State<Storage>) -> Result<()> {
    println!("palette_rgbw_set: {:?}", &data);
    with_focus(storage, |focus| Ok(focus.palette_rgbw_set(&data)?))
}

#[tauri::command]
fn color_map_get(storage: State<Storage>) -> Result<Vec<u8>> {
    with_focus(storage, |focus| Ok(focus.color_map_get()?))
}

#[tauri::command]
fn color_map_set(data: Vec<u8>, storage: State<Storage>) -> Result<()> {
    with_focus(storage, |focus| Ok(focus.color_map_set(&data)?))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                .format(|out, message, record| {
                    let label = if record.target() == "blazecor_lib" { "B" } else { "F" };
                    out.finish(format_args!("[{}] {}: {}", record.level(), label, message))
                })
                .level(log::LevelFilter::Debug)
                .build(),
        )
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
            settings_set,
            palette_rgb_get,
            palette_rgb_set,
            palette_rgbw_get,
            palette_rgbw_set,
            color_map_get,
            color_map_set,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
