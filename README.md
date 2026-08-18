
# 🎙️ AcousticSpace – AI-Powered Deepfake Voice Detection
# AcousticSpace – Deepfake Voice Detection

> **An AI-powered audio forensic and deepfake voice detection system using AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks), acoustic analysis, and Room Impulse Response (RIR) analysis.**
AcousticSpace is a full-stack audio forensics project for classifying speech samples as **real human voice** or **AI-generated/deepfake voice**. It combines an AASIST-based backend model with a modern React dashboard for upload, analysis, visualization, and reporting.

---
## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Model Training and Evaluation](#model-training-and-evaluation)
- [Troubleshooting](#troubleshooting)
- [Tech Stack](#tech-stack)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## 📌 Project Overview
## Overview

**AcousticSpace** is an AI-powered **Deepfake Voice Detection and Audio Forensics platform** designed to analyze speech/audio recordings and determine whether the input is:
The platform is designed for deepfake-audio detection workflows:
1. Upload an audio sample.
2. Extract acoustic and spectral features.
3. Run AASIST anti-spoofing inference.
4. Return prediction + confidence + analysis artifacts.
5. Visualize results in the frontend dashboard.

- 🟢 **Genuine / Bonafide Speech**
- 🔴 **Spoofed / Deepfake Speech**
## Key Features

The core detection system is based on the **AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks)** deep learning architecture.
- **Deepfake Detection** using AASIST model inference.
- **Feature Extraction** including waveform, mel spectrogram, MFCC, spectrogram, chroma, spectral contrast, and RIR visualization.
- **Breathing Analysis** integrated into backend response.
- **Interactive Frontend** with upload, dashboard, history, and report generation flows.
- **FastAPI Backend** with REST endpoints for health and prediction.

In addition to deepfake classification, AcousticSpace provides an acoustic analysis workflow that includes:
## Architecture

- Audio preprocessing
- Acoustic feature extraction
- Room Impulse Response (RIR) analysis
- AASIST-based anti-spoofing inference
- Prediction confidence analysis
- Audio waveform visualization
- Acoustic/RIR visualization
- Detection history
- Statistics
- Interactive web dashboard
- FastAPI backend services
- **Frontend:** React + TypeScript + Vite (`/frontend`)
- **Backend/Model:** FastAPI + PyTorch AASIST pipeline (`/aasist`)
- **Model Assets:** configuration files and pretrained weights under `/aasist/config` and `/aasist/models/weights`

The project is structured as a modular full-stack application with a **Python/FastAPI AI backend** and a **React + TypeScript frontend**.
## Repository Structure

---
```text
AcousticSpace-Deepfake-Detection/
├── README.md                  # Project-level documentation
├── frontend/                  # React + TypeScript dashboard
│   ├── src/
│   └── package.json
└── aasist/                    # AASIST model + FastAPI service
    ├── app.py                 # FastAPI inference API
    ├── main.py                # Training/evaluation entrypoint
    ├── predict.py             # CLI prediction script
    ├── config/                # Model configs
    ├── models/                # Model definitions and weights
    └── requirements.txt
```

# 🎯 Project Objectives
## Prerequisites

The primary objectives of AcousticSpace are:
### General
- Git
- Python 3.9+
- Node.js 18+ and npm

1. Detect AI-generated and spoofed human speech.
2. Classify audio as **Genuine/Bonafide** or **Spoofed/Deepfake**.
3. Use the AASIST architecture for audio anti-spoofing.
4. Perform audio preprocessing and analysis before model inference.
5. Extract acoustic characteristics from speech/audio recordings.
6. Analyze Room Impulse Response (RIR)-related acoustic information.
7. Provide prediction confidence information.
8. Provide an interactive web dashboard for audio analysis.
9. Provide a FastAPI backend for model inference.
10. Provide visualization and forensic information alongside the prediction.
11. Maintain a modular backend and frontend architecture.
12. Provide a foundation that can be extended for real-time detection and production deployment.
### Recommended for model inference/training
- CUDA-capable GPU (optional but recommended)

---
## Quick Start

# ✨ Key Features
### 1) Clone and enter the repository

## 🤖 AI-Based Deepfake Voice Detection
```bash
git clone <your-fork-or-repo-url>
cd AcousticSpace-Deepfake-Detection
```

AcousticSpace uses the **AASIST** anti-spoofing architecture to analyze speech/audio recordings.
### 2) Start backend (FastAPI + model)

The system is designed to distinguish between:
```bash
cd aasist
python -m venv .venv
source .venv/bin/activate        # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

```text
Genuine / Bonafide Speech
             vs.
Spoofed / Deepfake Speech
Backend will be available at `http://localhost:8000`.
> **Important:** `aasist/app.py` and `aasist/predict.py` currently include a hardcoded local Windows weights path. Update the weights path to a valid local path before running inference.
### 3) Start frontend (React dashboard)
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:5173`.
## API Reference
### `GET /`
Returns service status message.
### `GET /health`
Returns backend health status.
### `POST /predict`
Accepts multipart form-data with a `file` field (audio file).
**Response fields include:**
- `prediction` (e.g., `REAL HUMAN VOICE` / `AI GENERATED VOICE`)
- `confidence` (percentage)
- `breathing` (breathing analysis output)
- `features` object with generated visualization asset paths
## Model Training and Evaluation
The AASIST module supports training/evaluation workflows from `aasist/main.py`.
```bash
cd aasist
python main.py --config ./config/AASIST.conf
python main.py --eval --config ./config/AASIST.conf
```
Alternative configs are available for:
- `AASIST-L`
- `RawNet2` baseline
- `RawGAT-ST` baseline
For full model-specific details and references, see `/aasist/README.md`.
## Troubleshooting
- **Frontend cannot connect to backend:** ensure FastAPI is running at `http://localhost:8000` or update backend URL in Settings.
- **Model load failure:** verify weights path in `aasist/app.py` and `aasist/predict.py`.
- **Missing Python dependencies:** install all required packages and verify your virtual environment is active.
- **CORS issues:** use default frontend URL (`http://localhost:5173`) or update CORS config in `aasist/app.py`.
## Tech Stack
- **AI/ML:** PyTorch, NumPy
- **API:** FastAPI
- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Visualization:** WaveSurfer.js, Recharts
## Acknowledgements
- AASIST authors and contributors
- ASVspoof community and datasets
- Open-source dependencies used across backend and frontend
## License
License information for the AASIST module is available 
