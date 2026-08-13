"""Thin wrapper around the AI4Bharat Vistaar IndicWhisper inference snippet.

Reference: https://github.com/AI4Bharat/vistaar (README, "Inference using IndicWhisper")
"""
from __future__ import annotations

from typing import Optional

from transformers import pipeline


class IndicWhisperASR:
    """Loads an IndicWhisper checkpoint and transcribes audio files."""

    def __init__(self, model_path: str, lang_code: str = "hi", device: Optional[str] = None):
        self.model_path = model_path
        self.lang_code = lang_code
        self.device = device or self._default_device()

        self.pipe = pipeline(
            "automatic-speech-recognition",
            model=self.model_path,
            device=self.device,
        )

        # Special case to handle Odia, since it isn't supported by the Whisper
        # tokenizer's language list.
        if self.lang_code == "or":
            forced_ids = self.pipe.tokenizer.get_decoder_prompt_ids(
                language=None, task="transcribe"
            )
        else:
            forced_ids = self.pipe.tokenizer.get_decoder_prompt_ids(
                language=self.lang_code, task="transcribe"
            )
        self.pipe.model.config.forced_decoder_ids = forced_ids

    @staticmethod
    def _default_device() -> str:
        try:
            import torch

            return "cuda" if torch.cuda.is_available() else "cpu"
        except ImportError:
            return "cpu"

    def transcribe(self, audio_path: str) -> str:
        result = self.pipe(audio_path)
        return result["text"]
