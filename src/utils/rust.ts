import { invoke } from "@tauri-apps/api/core";

export async function rustInvoke<T>(call: string): Promise<T> {
    const json = await invoke<string>(call)
    return JSON.parse(json);
}
