import librosa
import numpy as np


def analyze_breathing(audio_path):
    # Load audio
    y, sr = librosa.load(audio_path, sr=16000)

    # Remove leading and trailing silence
    y, _ = librosa.effects.trim(y)

    # Prevent empty audio after trimming
    if len(y) == 0:
        return {
            "breath_score": 0.0,
            "breathing_status": "Unknown",
            "analysis": "Unable to analyze breathing pattern.",
            "details": {
                "rms_variation": 0.0,
                "zero_crossing_rate": 0.0,
                "spectral_variation": 0.0,
                "silence_ratio": 0.0,
            }
        }

    # -------------------------------------------------
    # Feature 1 : RMS Energy Variation
    # -------------------------------------------------
    rms = librosa.feature.rms(y=y)[0]
    rms_std = float(np.std(rms))

    # -------------------------------------------------
    # Feature 2 : Zero Crossing Rate
    # -------------------------------------------------
    zcr = librosa.feature.zero_crossing_rate(y)[0]
    zcr_mean = float(np.mean(zcr))

    # -------------------------------------------------
    # Feature 3 : Spectral Centroid Variation
    # -------------------------------------------------
    centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
    centroid_std = float(np.std(centroid))

    # -------------------------------------------------
    # Feature 4 : Silence Ratio
    # -------------------------------------------------
    silence_ratio = float(np.sum(np.abs(y) < 0.005) / len(y))

    # -------------------------------------------------
    # Normalize Features
    # -------------------------------------------------
    rms_score = min(rms_std * 10.0, 1.0)
    zcr_score = min(zcr_mean * 5.0, 1.0)
    centroid_score = min(centroid_std / 2500.0, 1.0)
    silence_score = min(silence_ratio, 1.0)

    # -------------------------------------------------
    # Final Breathing Score
    # -------------------------------------------------
    breath_score = (
        0.40 * rms_score +
        0.20 * zcr_score +
        0.20 * centroid_score +
        0.20 * silence_score
    )

    # -------------------------------------------------
    # Breathing Stability Classification
    # -------------------------------------------------
    if breath_score < 0.30:
        status = "Very Stable"

    elif breath_score < 0.55:
        status = "Stable"

    elif breath_score < 0.80:
        status = "Moderately Variable"

    else:
        status = "Highly Variable"

    # -------------------------------------------------
    # Human-readable explanation
    # -------------------------------------------------
    if status == "Very Stable":
        analysis = (
            "Breathing pattern is highly stable with minimal acoustic variability."
        )

    elif status == "Stable":
        analysis = (
            "Breathing pattern is stable and consistent throughout the recording."
        )

    elif status == "Moderately Variable":
        analysis = (
            "Breathing pattern shows moderate acoustic variability, which is commonly observed in natural speech."
        )

    else:
        analysis = (
            "Breathing pattern exhibits high acoustic variability throughout the recording."
        )

    # -------------------------------------------------
    # Return Results
    # -------------------------------------------------
    return {
        "breath_score": round(float(breath_score), 3),

        "breathing_status": status,

        "analysis": analysis,

        "details": {
            "rms_variation": round(rms_std, 4),
            "zero_crossing_rate": round(zcr_mean, 4),
            "spectral_variation": round(centroid_std, 2),
            "silence_ratio": round(silence_ratio, 3),
        }
    }