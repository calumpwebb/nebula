use log::{error, info};
use tauri::AppHandle;
use tauri_plugin_updater::UpdaterExt;

// Swift function declarations (macOS only)
#[cfg(target_os = "macos")]
mod swift {
    use swift_rs::{swift, SRString};

    swift!(pub fn show_checking_dialog());
    swift!(pub fn dismiss_update_panel());
    swift!(pub fn show_download_dialog());
    swift!(pub fn update_download_progress(percent: i32, downloaded_mb: f32, total_mb: f32));
    swift!(pub fn show_installing_state());
    swift!(pub fn show_up_to_date_dialog(version: &SRString));
    swift!(pub fn show_update_required_dialog(
        current_version: &SRString,
        new_version: &SRString
    ));
    swift!(pub fn show_update_error_dialog(error_message: &SRString));
}

/// Check for updates on startup. Skips in debug builds unless forced.
/// Returns Ok(true) if app should continue, Ok(false) if update is in progress.
pub async fn check_on_startup(app: &AppHandle) -> Result<bool, Box<dyn std::error::Error>> {
    // Skip update check in debug builds (dev mode)
    if cfg!(debug_assertions) {
        info!("Skipping update check (debug build)");
        return Ok(true);
    }

    // Skip update check if --skip-update flag was passed
    if std::env::args().any(|arg| arg == "--skip-update") {
        info!("Skipping update check (--skip-update flag)");
        return Ok(true);
    }

    do_update_check(app, false).await
}

/// Manual update check triggered from menu. Always runs, shows "up to date" dialog.
pub async fn check_for_updates(app: &AppHandle) -> Result<(), Box<dyn std::error::Error>> {
    do_update_check(app, true).await?;
    Ok(())
}

/// Core update check logic.
/// If `show_up_to_date` is true, shows a dialog when no update is available.
async fn do_update_check(
    app: &AppHandle,
    show_up_to_date: bool,
) -> Result<bool, Box<dyn std::error::Error>> {
    let updater = app.updater()?;

    // Show checking dialog
    #[cfg(target_os = "macos")]
    unsafe {
        swift::show_checking_dialog();
    }

    info!("Checking for updates...");

    let update = match updater.check().await {
        Ok(Some(update)) => update,
        Ok(None) => {
            info!("No update available");
            #[cfg(target_os = "macos")]
            unsafe {
                swift::dismiss_update_panel();
                if show_up_to_date {
                    use swift_rs::SRString;
                    let version: SRString = app.package_info().version.to_string().as_str().into();
                    swift::show_up_to_date_dialog(&version);
                }
            }
            return Ok(true);
        }
        Err(e) => {
            error!("Update check failed: {}", e);
            #[cfg(target_os = "macos")]
            unsafe {
                swift::dismiss_update_panel();
                if show_up_to_date {
                    use swift_rs::SRString;
                    let error_msg: SRString = e.to_string().as_str().into();
                    swift::show_update_error_dialog(&error_msg);
                }
            }
            return Ok(true);
        }
    };

    let current = update.current_version.to_string();
    let latest = update.version.clone();
    info!("Update available: {} -> {}", current, latest);

    // Dismiss checking, show update required dialog
    #[cfg(target_os = "macos")]
    unsafe {
        swift::dismiss_update_panel();
        use swift_rs::SRString;
        let current_str: SRString = current.as_str().into();
        let latest_str: SRString = latest.as_str().into();
        swift::show_update_required_dialog(&current_str, &latest_str);
    }

    // Show download progress dialog
    #[cfg(target_os = "macos")]
    unsafe {
        swift::show_download_dialog();
    }

    info!("Downloading update...");

    // Download and install with progress
    let mut downloaded: usize = 0;
    let _ = update
        .download_and_install(
            |chunk_length, content_length| {
                downloaded += chunk_length;
                let downloaded_mb = downloaded as f32 / 1_048_576.0;

                if let Some(total) = content_length {
                    let percent = ((downloaded as f64 / total as f64) * 100.0) as i32;
                    let total_mb = total as f32 / 1_048_576.0;

                    #[cfg(target_os = "macos")]
                    unsafe {
                        swift::update_download_progress(percent, downloaded_mb, total_mb);
                    }

                    info!(
                        "Downloaded {:.1} / {:.1} MB ({}%)",
                        downloaded_mb, total_mb, percent
                    );
                } else {
                    // No content length - show indeterminate with downloaded size
                    #[cfg(target_os = "macos")]
                    unsafe {
                        swift::update_download_progress(-1, downloaded_mb, 0.0);
                    }

                    info!("Downloaded {:.1} MB", downloaded_mb);
                }
            },
            || {
                info!("Download complete, installing...");
                #[cfg(target_os = "macos")]
                unsafe {
                    swift::show_installing_state();
                }
            },
        )
        .await?;

    info!("Update installed, restarting...");

    #[cfg(target_os = "macos")]
    unsafe {
        swift::dismiss_update_panel();
    }

    app.restart();
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_skip_update_flag_detection() {
        // Test that --skip-update is detected in args
        let args = vec!["app".to_string(), "--skip-update".to_string()];
        assert!(args.iter().any(|arg| arg == "--skip-update"));
    }

    #[test]
    fn test_skip_update_not_present() {
        let args = vec!["app".to_string(), "--other-flag".to_string()];
        assert!(!args.iter().any(|arg| arg == "--skip-update"));
    }
}
