use tauri::Emitter;

#[tauri::command]
async fn start_server(window: tauri::Window) -> Result<u16, String> {
    let config = tauri_plugin_oauth::OauthConfig {
        ports: Some(vec![8000]),
        response: Some("Great Success".into()),
    };
    tauri_plugin_oauth::start_with_config(config, move |url| {
        // Because of the unprotected localhost port, you must verify the URL here.
        // Preferebly send back only the token, or nothing at all if you can handle everything else in Rust.
        let _ = window.emit("redirect_uri", url);
    }).map_err(|err| err.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_oauth::init())
        .invoke_handler(tauri::generate_handler![start_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
