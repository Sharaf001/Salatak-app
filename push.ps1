Set-Location "C:\salatak-project"

$status = git status --porcelain
if (-not $status) {
    Write-Host "Nothing to push — no changes detected."
    Read-Host "Press Enter to close"
    exit
}

git add .

$msg = Read-Host "Commit message (press Enter for a default one)"
if ([string]::IsNullOrWhiteSpace($msg)) {
    $msg = "Update " + (Get-Date -Format "yyyy-MM-dd HH:mm")
}

git commit -m "$msg"
git push

Read-Host "Done. Press Enter to close"
