#!/usr/bin/env python3
"""Download and extract the AI4Bharat Vistaar Hindi IndicWhisper checkpoint.

Usage:
    python scripts/download_model.py

Downloads hindi_models.zip from AI4Bharat's object store and extracts it into
./models/, producing:
    models/hindi_models/whisper-medium-hi_alldata_multigpu/

Note: run this from a machine with unrestricted internet access and several
GB of free disk space. The checkpoint is large.
"""
import sys
import urllib.request
import zipfile
from pathlib import Path

MODEL_URL = "https://indicwhisper.objectstore.e2enetworks.net/hindi_models.zip"
DEST_DIR = Path(__file__).resolve().parent.parent / "models"
ZIP_PATH = DEST_DIR / "hindi_models.zip"


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading {url}\n  -> {dest}")

    def _progress(block_num, block_size, total_size):
        if total_size <= 0:
            return
        done = min(block_num * block_size, total_size)
        pct = done / total_size * 100
        sys.stdout.write(f"\r  {pct:5.1f}%")
        sys.stdout.flush()

    urllib.request.urlretrieve(url, dest, reporthook=_progress)
    print()


def extract(zip_path: Path, dest_dir: Path) -> None:
    print(f"Extracting {zip_path}\n  -> {dest_dir}")
    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(dest_dir)


def main() -> None:
    target = DEST_DIR / "hindi_models"
    if target.exists():
        print(f"Model already present at {target}, skipping.")
        return

    download(MODEL_URL, ZIP_PATH)
    extract(ZIP_PATH, DEST_DIR)
    ZIP_PATH.unlink()
    print("Done. Model extracted to:", target)


if __name__ == "__main__":
    main()
