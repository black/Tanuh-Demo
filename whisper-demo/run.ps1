# Starts the IndicWhisper Hindi ASR demo server (Windows / PowerShell)
# Run from the repo root:  .\run.ps1

$ErrorActionPreference = "Stop"
& .\.venv\Scripts\python.exe -m uvicorn app:app --reload
