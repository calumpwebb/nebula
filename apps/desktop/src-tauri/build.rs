fn main() {
    // Only link Swift on macOS
    #[cfg(target_os = "macos")]
    {
        use swift_rs::SwiftLinker;
        SwiftLinker::new("10.13")
            .with_package("swift-lib", "./swift-lib/")
            .link();
    }

    tauri_build::build()
}
