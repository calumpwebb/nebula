import AppKit
import SwiftRs

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

/// Show "You're up to date" dialog with app icon
/// Returns when user dismisses
@_cdecl("show_up_to_date_dialog")
public func showUpToDateDialog(version: SRString) {
    let versionStr = version.toString()

    DispatchQueue.main.sync {
        let alert = NSAlert()
        alert.messageText = "You're up to date!"
        alert.informativeText = "Nebula \(versionStr) is currently the newest version available."
        alert.alertStyle = .informational
        alert.icon = getAppIcon()
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
}

/// Show "Update available" dialog with app icon
/// Returns true if user chose to update, false if they chose later
@_cdecl("show_update_available_dialog")
public func showUpdateAvailableDialog(currentVersion: SRString, newVersion: SRString) -> Bool {
    let current = currentVersion.toString()
    let new = newVersion.toString()

    var result = false
    DispatchQueue.main.sync {
        let alert = NSAlert()
        alert.messageText = "Update Available"
        alert.informativeText = "A new version of Nebula is available.\n\nCurrent: \(current)\nNew: \(new)"
        alert.alertStyle = .informational
        alert.icon = getAppIcon()
        alert.addButton(withTitle: "Update Now")
        alert.addButton(withTitle: "Later")
        result = alert.runModal() == .alertFirstButtonReturn
    }
    return result
}

/// Show "Update required" dialog - no cancel option
@_cdecl("show_update_required_dialog")
public func showUpdateRequiredDialog(newVersion: SRString) {
    let new = newVersion.toString()

    DispatchQueue.main.sync {
        let alert = NSAlert()
        alert.messageText = "Update Required"
        alert.informativeText = "Version \(new) is available.\n\nYou must update to continue using the app."
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
        alert.informativeText = "Could not check for updates:\n\n\(error)"
        alert.alertStyle = .warning
        alert.icon = getAppIcon()
        alert.addButton(withTitle: "OK")
        alert.runModal()
    }
}
