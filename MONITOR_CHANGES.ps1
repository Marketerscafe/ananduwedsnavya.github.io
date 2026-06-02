# File Change Monitor - Wedding Invitation Site
# Real-time monitoring for project file changes
# Usage: powershell -ExecutionPolicy Bypass -File MONITOR_CHANGES.ps1

$projectPath = "C:\Users\Hp\Downloads\INV"
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $projectPath
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true

# File patterns to monitor
$monitorExtensions = @(".js", ".css", ".html", ".md")

Write-Host "🔍 FILE MONITOR ACTIVE" -ForegroundColor Cyan
Write-Host "📁 Watching: $projectPath" -ForegroundColor Green
Write-Host "📝 Monitoring extensions: $($monitorExtensions -join ', ')" -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop monitoring`n" -ForegroundColor Gray

# Event handler for file creation
$onCreate = {
    $fileName = $Event.SourceEventArgs.Name
    $fullPath = $Event.SourceEventArgs.FullPath
    $ext = [System.IO.Path]::GetExtension($fileName)
    
    if ($monitorExtensions -contains $ext) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✨ NEW FILE CREATED: $fileName" -ForegroundColor Green
        $fileSize = (Get-Item $fullPath -ErrorAction SilentlyContinue).Length
        Write-Host "  └─ Size: $($fileSize) bytes" -ForegroundColor DarkGreen
    }
}

# Event handler for file modification
$onChanged = {
    $fileName = $Event.SourceEventArgs.Name
    $fullPath = $Event.SourceEventArgs.FullPath
    $ext = [System.IO.Path]::GetExtension($fileName)
    
    if ($monitorExtensions -contains $ext) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 📝 FILE MODIFIED: $fileName" -ForegroundColor Yellow
        $fileSize = (Get-Item $fullPath -ErrorAction SilentlyContinue).Length
        Write-Host "  └─ Size: $($fileSize) bytes | Modified: $(Get-Item $fullPath).LastWriteTime" -ForegroundColor DarkYellow
    }
}

# Event handler for file deletion
$onDeleted = {
    $fileName = $Event.SourceEventArgs.Name
    $ext = [System.IO.Path]::GetExtension($fileName)
    
    if ($monitorExtensions -contains $ext) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ❌ FILE DELETED: $fileName" -ForegroundColor Red
    }
}

# Event handler for file rename
$onRenamed = {
    $oldName = $Event.SourceEventArgs.OldName
    $newName = $Event.SourceEventArgs.Name
    $ext = [System.IO.Path]::GetExtension($newName)
    
    if ($monitorExtensions -contains $ext) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 🔄 FILE RENAMED: $oldName → $newName" -ForegroundColor Cyan
    }
}

# Register event handlers
Register-ObjectEvent -InputObject $watcher -EventName Created -Action $onCreate | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName Changed -Action $onChanged | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName Deleted -Action $onDeleted | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName Renamed -Action $onRenamed | Out-Null

Write-Host "✅ Monitoring started. Waiting for file changes..." -ForegroundColor Green

# Keep the script running
while ($true) {
    Start-Sleep -Milliseconds 100
}
