# Setup script for the IndicWhisper Hindi ASR demo (Windows / PowerShell)
# Run from the repo root:  .\setup.ps1
# If scripts are blocked, first run:  Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

$ErrorActionPreference = "Stop"

Write-Host "Checking for ffmpeg..."
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ffmpeg not found. Installing via winget..."
    winget install --id Gyan.FFmpeg -e --source winget
    Write-Host "ffmpeg installed. You may need to open a new terminal for PATH changes to apply."
} else {
    Write-Host "ffmpeg already installed."
}

Write-Host "Creating virtual environment (.venv)..."
python -m venv .venv

Write-Host "Installing Python dependencies..."
& .\.venv\Scripts\pip.exe install -r requirements.txt

Write-Host "Downloading the Hindi IndicWhisper model (this is large, be patient)..."
& .\.venv\Scripts\python.exe scripts\download_model.py

Write-Host ""
Write-Host "Setup complete. Start the server with: .\run.ps1"
