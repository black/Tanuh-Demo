# IndicWhisper Hindi ASR Demo

FastAPI backend + minimal HTML page around AI4Bharat's [Vistaar](https://github.com/AI4Bharat/vistaar) IndicWhisper Hindi checkpoint.

## Setup (Windows)

One-time, from PowerShell in the repo root:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass   # allow running local scripts this session
.\setup.ps1
```

This installs ffmpeg (via winget, if missing), creates a `.venv`, installs Python dependencies, and downloads the Hindi model checkpoint into `models/`. Run it on a machine with unrestricted internet access and a few GB of free disk. A GPU is optional — the app falls back to CPU automatically.

If `winget` isn't available, install ffmpeg manually from https://www.gyan.dev/ffmpeg/builds/ and add its `bin` folder to your PATH, then re-run `.\setup.ps1`.

### Manual setup (equivalent, without the script)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python scripts\download_model.py
```

## Run

```powershell
.\run.ps1
```

or manually:

```powershell
.\.venv\Scripts\Activate.ps1
uvicorn app:app --reload
```

Open http://localhost:8000, upload an audio file, click Transcribe.

## API

`POST /transcribe` — multipart form field `file` (any ffmpeg-readable audio). Returns `{"text": "..."}`.

`GET /health` — reports whether the model has been downloaded/loaded.

## Config

Environment variables (all optional):

| Variable | Default | Purpose |
|---|---|---|
| `MODEL_PATH` | `models/hindi_models/whisper-medium-hi_alldata_multigpu` | Path to the checkpoint |
| `LANG_CODE` | `hi` | Whisper language code |
| `DEVICE` | auto (`cuda` if available, else `cpu`) | Force `cpu` or `cuda` |

## Notes

- The model is loaded lazily on the first `/transcribe` call, so the server starts instantly.
- `models/` is gitignored — checkpoints are not meant to live in the repo.
