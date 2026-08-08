from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import shutil
import json
import numpy as np
import soundfile as sf
import torch
import torch.nn.functional as F
from breathing_analysis import analyze_breathing

from feature_extractor import (
    load_audio as librosa_load_audio,
    create_output_folder,
    save_waveform,
    save_mel_spectrogram,
    save_mfcc,
    save_spectrogram,
    save_chroma,
    save_spectral_contrast,
    save_rir,
)
from main import get_model

app = FastAPI(title="AcousticSpace API")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

app.mount(
    "/feature_outputs",
    StaticFiles(directory=os.path.join(BASE_DIR, "feature_outputs")),
    name="feature_outputs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Load model only once
# -----------------------

with open("config/AASIST.conf", "r") as f:
    config = json.load(f)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = get_model(config["model_config"], device)

checkpoint = torch.load(
    r"D:\vinay model trainig internship\Acoustic Model\Model training\aasist\exp_result\LA_AASIST_ep10_bs4\weights\best.pth",
    map_location=device
)

model.load_state_dict(checkpoint)
model.eval()


# -----------------------
# Audio functions
# -----------------------

def pad(x, max_len=64600):
    if len(x) >= max_len:
        return x[:max_len]

    num_repeats = int(max_len / len(x)) + 1
    return np.tile(x, num_repeats)[:max_len]


def load_audio(audio_path):
    audio, sr = sf.read(audio_path)

    if len(audio.shape) > 1:
        audio = np.mean(audio, axis=1)

    audio = pad(audio, 64600)

    return torch.FloatTensor(audio).unsqueeze(0)


# -----------------------
# Home API
# -----------------------

@app.get("/")
def home():
    return {"message": "AcousticSpace API Running"}

@app.get("/health")
def health():
    return {
        "status": "online",
        "backend": "running"
    }


# -----------------------
# Prediction API
# -----------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    temp_file = "temp.flac"

    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
                # -----------------------
        # Generate Librosa Features
        # -----------------------

        audio_librosa, sr = librosa_load_audio(temp_file)

        output_dir = create_output_folder()

        waveform = save_waveform(audio_librosa, sr, output_dir)

        mel = save_mel_spectrogram(audio_librosa, sr, output_dir)

        mfcc = save_mfcc(audio_librosa, sr, output_dir)

        spectrogram = save_spectrogram(audio_librosa, sr, output_dir)

        chroma = save_chroma(audio_librosa, sr, output_dir)

        spectral = save_spectral_contrast(audio_librosa, sr, output_dir)

        rir = save_rir(audio_librosa, sr, output_dir)

    audio = load_audio(temp_file).to(device)
    breathing = analyze_breathing(temp_file)

    with torch.no_grad():

        _, output = model(audio)

        probability = F.softmax(output, dim=1)

        confidence, prediction = torch.max(probability, dim=1)

    if prediction.item() == 1:
        label = "REAL HUMAN VOICE"
    else:
        label = "AI GENERATED VOICE"

    return {
    "prediction": label,
    "confidence": round(confidence.item() * 100, 2),
    "breathing": breathing,
    "features": {
        "waveform": waveform,
        "mel": mel,
        "mfcc": mfcc,
        "spectrogram": spectrogram,
        "chroma": chroma,
        "spectral_contrast": spectral,
        "rir": rir
    }
}
