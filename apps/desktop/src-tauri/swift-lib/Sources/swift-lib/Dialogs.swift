import AppKit
import SwiftRs

// MARK: - Helpers

/// Apply macOS-style rounded rect mask to an icon
private func applyIconMask(to image: NSImage, size: CGFloat = 128) -> NSImage {
    let targetSize = NSSize(width: size, height: size)
    let cornerRadius = size * 0.225 // macOS icon corner radius ratio

    let result = NSImage(size: targetSize)
    result.lockFocus()

    let rect = NSRect(origin: .zero, size: targetSize)
    let path = NSBezierPath(roundedRect: rect, xRadius: cornerRadius, yRadius: cornerRadius)
    path.addClip()

    image.draw(in: rect, from: .zero, operation: .sourceOver, fraction: 1.0)

    result.unlockFocus()
    return result
}

/// Get the app icon with macOS rounded mask applied
private func getAppIcon() -> NSImage {
    let bundlePath = Bundle.main.bundlePath

    // In production (.app bundle), NSWorkspace gives us the properly masked icon
    if bundlePath.hasSuffix(".app") {
        return NSWorkspace.shared.icon(forFile: bundlePath)
    } else {
        // Dev mode - apply rounded mask manually
        if let rawIcon = NSApp.applicationIconImage {
            return applyIconMask(to: rawIcon)
        }
        return NSImage()
    }
}

// MARK: - Update Dialogs (non-blocking)

private var updatePanel: NSPanel?
private var progressBar: NSProgressIndicator?
private var statusLabel: NSTextField?

/// Show "Checking for updates..." panel with spinner
@_cdecl("show_checking_dialog")
public func showCheckingDialog() {
    DispatchQueue.main.sync {
        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 300, height: 70),
            styleMask: [.titled, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        panel.title = ""
        panel.titlebarAppearsTransparent = true
        panel.isMovableByWindowBackground = true
        panel.level = .modalPanel
        panel.center()

        let contentView = NSView(frame: panel.contentView!.bounds)

        // Icon
        let iconView = NSImageView(frame: NSRect(x: 20, y: 15, width: 40, height: 40))
        iconView.image = getAppIcon()
        contentView.addSubview(iconView)

        // Label
        let label = NSTextField(labelWithString: "Checking for updates...")
        label.frame = NSRect(x: 70, y: 28, width: 180, height: 20)
        label.font = NSFont.systemFont(ofSize: 13, weight: .medium)
        contentView.addSubview(label)
        statusLabel = label

        // Spinner (indeterminate)
        let progress = NSProgressIndicator(frame: NSRect(x: 70, y: 12, width: 200, height: 12))
        progress.style = .bar
        progress.isIndeterminate = true
        progress.startAnimation(nil)
        contentView.addSubview(progress)
        progressBar = progress

        panel.contentView = contentView
        panel.makeKeyAndOrderFront(nil)
        updatePanel = panel
    }
}

/// Dismiss the update panel
@_cdecl("dismiss_update_panel")
public func dismissUpdatePanel() {
    DispatchQueue.main.sync {
        progressBar?.stopAnimation(nil)
        updatePanel?.close()
        updatePanel = nil
        progressBar = nil
        statusLabel = nil
    }
}

/// Show download progress panel
@_cdecl("show_download_dialog")
public func showDownloadDialog() {
    DispatchQueue.main.sync {
        let panel = NSPanel(
            contentRect: NSRect(x: 0, y: 0, width: 300, height: 70),
            styleMask: [.titled, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )
        panel.title = ""
        panel.titlebarAppearsTransparent = true
        panel.isMovableByWindowBackground = true
        panel.level = .modalPanel
        panel.center()

        let contentView = NSView(frame: panel.contentView!.bounds)

        // Icon
        let iconView = NSImageView(frame: NSRect(x: 20, y: 15, width: 40, height: 40))
        iconView.image = getAppIcon()
        contentView.addSubview(iconView)

        // Label
        let label = NSTextField(labelWithString: "Downloading update...")
        label.frame = NSRect(x: 70, y: 28, width: 200, height: 20)
        label.font = NSFont.systemFont(ofSize: 13, weight: .medium)
        contentView.addSubview(label)
        statusLabel = label

        // Progress bar (determinate)
        let progress = NSProgressIndicator(frame: NSRect(x: 70, y: 12, width: 200, height: 12))
        progress.style = .bar
        progress.isIndeterminate = false
        progress.minValue = 0
        progress.maxValue = 100
        progress.doubleValue = 0
        contentView.addSubview(progress)
        progressBar = progress

        panel.contentView = contentView
        panel.makeKeyAndOrderFront(nil)
        updatePanel = panel
    }
}

/// Update download progress (0-100)
@_cdecl("update_download_progress")
public func updateDownloadProgress(percent: Int32, downloadedMB: Float, totalMB: Float) {
    DispatchQueue.main.async {
        progressBar?.doubleValue = Double(percent)
        statusLabel?.stringValue = String(format: "Downloading... %.1f / %.1f MB", downloadedMB, totalMB)
    }
}

/// Show installing state
@_cdecl("show_installing_state")
public func showInstallingState() {
    DispatchQueue.main.async {
        statusLabel?.stringValue = "Installing update..."
        progressBar?.isIndeterminate = true
        progressBar?.startAnimation(nil)
    }
}

// MARK: - Result Dialogs

/// Show "You're up to date" dialog
@_cdecl("show_up_to_date_dialog")
public func showUpToDateDialog(version: SRString) {
    let versionStr = version.toString()

    DispatchQueue.main.sync {
        let alert = NSAlert()
        alert.messageText = "You're up to date!"
        alert.informativeText = "Nebula \(versionStr) is the latest version."
        alert.alertStyle = .informational
        alert.icon = getAppIcon()
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
}

/// Show "Update required" dialog - no cancel option
@_cdecl("show_update_required_dialog")
public func showUpdateRequiredDialog(currentVersion: SRString, newVersion: SRString) {
    let current = currentVersion.toString()
    let new = newVersion.toString()

    DispatchQueue.main.sync {
        let alert = NSAlert()
        alert.messageText = "Update Required"
        alert.informativeText = "Please install the latest version of Nebula to continue.\n\n\(current) → \(new)"
        alert.alertStyle = .informational
        alert.icon = getAppIcon()
        alert.addButton(withTitle: "Update Now")
        alert.runModal()
    }
}

/// Show error dialog
@_cdecl("show_update_error_dialog")
public func showUpdateErrorDialog(errorMessage: SRString) {
    let error = errorMessage.toString()

    DispatchQueue.main.sync {
        let alert = NSAlert()
        alert.messageText = "Update Check Failed"
        alert.informativeText = error
        alert.alertStyle = .warning
        alert.icon = getAppIcon()
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
}
