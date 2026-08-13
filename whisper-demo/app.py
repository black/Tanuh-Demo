"""FastAPI demo app for the AI4Bharat Vistaar IndicWhisper Hindi ASR model.

Run with:
    uvicorn app:app --reload

Then open http://localhost:8000
"""
import os
import shutil
import tempfile
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from indicwhisper import IndicWhisperASR

APP_DIR = Path(__file__).parent
STATIC_DIR = APP_DIR / "static"

MODEL_PATH = os.environ.get(
    "MODEL_PATH", str(APP_DIR / "models" / "hindi_models" / "whisper-medium-hi_alldata_multigpu")
)
LANG_CODE = os.environ.get("LANG_CODE", "hi")
DEVICE = os.environ.get("DEVICE")  # unset -> auto-detect cuda/cpu

app = FastAPI(title="IndicWhisper Hindi ASR Demo")
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

_asr: Optional[IndicWhisperASR] = None


def get_asr() -> IndicWhisperASR:
    """Lazily loads the model on first request so the server starts instantly."""
    global _asr
    if _asr is None:
        _asr = IndicWhisperASR(model_path=MODEL_PATH, lang_code=LANG_CODE, device=DEVICE)
    return _asr


@app.get("/")
def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_path": MODEL_PATH,
        "model_downloaded": Path(MODEL_PATH).exists(),
        "model_loaded": _asr is not None,
    }


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    if not Path(MODEL_PATH).exists():
        raise HTTPException(
            status_code=503,
            detail=(
                f"Model not found at '{MODEL_PATH}'. "
                "Run `python scripts/download_model.py` first."
            ),
        )

    suffix = Path(file.filename or "audio").suffix or ".wav"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name

    try:
        text = get_asr().transcribe(tmp_path)
    except Exception as exc:  # surface a clean error message to the UI
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    finally:
        os.unlink(tmp_path)

    return JSONResponse({"text": text})


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
