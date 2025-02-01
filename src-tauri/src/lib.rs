use tauri::Emitter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|app, argv, _cwd| {
            if argv.len() > 1 && argv[1].starts_with("tauri-logto://callback") {
                let redirect_uri = argv[1].clone();
                app.emit("redirect_uri", redirect_uri)
                    .expect("failed to emit redirect_uri");
            }
        }));
    }

    builder
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            #[cfg(any(windows, target_os = "linux"))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                app.deep_link().register("tauri-logto")?;
                app.deep_link().on_open_url(|event| {
                    println!("deep link URLs: {:?}", event.urls());
                });
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
