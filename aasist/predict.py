import json
import argparse
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
import torch.nn.functional as F

from main import get_model


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


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--audio",
        required=True,
        help="Path to wav/flac audio file"
    )
    parser.add_argument(
        "--config",
        default="config/AASIST.conf",
        help="Configuration file"
    )
    parser.add_argument(
        "--weights",
        default=r"D:\vinay model trainig internship\Acoustic Model\Model training\aasist\exp_result\LA_AASIST_ep10_bs4\weights\best.pth",
        help="Model weights"
    )

    args = parser.parse_args()

    with open(args.config, "r") as f:
        config = json.load(f)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    print("Using Device:", device)

    model = get_model(config["model_config"], device)

    checkpoint = torch.load(args.weights, map_location=device)

    model.load_state_dict(checkpoint)

    model.eval()

    audio = load_audio(args.audio).to(device)

    with torch.no_grad():
        _, output = model(audio)

        probability = F.softmax(output, dim=1)

        confidence, prediction = torch.max(probability, dim=1)

    if prediction.item() == 1:
        label = "REAL HUMAN VOICE"
    else:
        label = "AI GENERATED VOICE"

    print("\n==============================")
    print("Prediction :", label)
    print("Confidence :", round(confidence.item() * 100, 2), "%")
    print("==============================\n")


if __name__ == "__main__":
    main()