from fastapi import FastAPI, UploadFile, File
import shutil
import json
import numpy as np
import soundfile as sf
import torch
import torch.nn.functional as F

from main import get_model

app = FastAPI(title="AcousticSpace API")

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


# -----------------------
# Prediction API
# -----------------------

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    temp_file = "temp.flac"

    with open(temp_file, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    audio = load_audio(temp_file).to(device)

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
        "confidence": round(confidence.item()*100,2)
    }