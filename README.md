# AcousticSpace – Deepfake Voice Detection

AcousticSpace is a full-stack audio forensics project for classifying speech samples as **real human voice** or **AI-generated/deepfake voice**. It combines an AASIST-based backend model with a modern React dashboard for upload, analysis, visualization, and reporting.

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

## Overview

The platform is designed for deepfake-audio detection workflows:
1. Upload an audio sample.
2. Extract acoustic and spectral features.
3. Run AASIST anti-spoofing inference.
4. Return prediction + confidence + analysis artifacts.
5. Visualize results in the frontend dashboard.

## Key Features

- **Deepfake Detection** using AASIST model inference.
- **Feature Extraction** including waveform, mel spectrogram, MFCC, spectrogram, chroma, spectral contrast, and RIR visualization.
- **Breathing Analysis** integrated into backend response.
- **Interactive Frontend** with upload, dashboard, history, and report generation flows.
- **FastAPI Backend** with REST endpoints for health and prediction.

## Architecture

- **Frontend:** React + TypeScript + Vite (`/frontend`)
- **Backend/Model:** FastAPI + PyTorch AASIST pipeline (`/aasist`)
- **Model Assets:** configuration files and pretrained weights under `/aasist/config` and `/aasist/models/weights`

## Repository Structure

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

## Prerequisites

### General
- Git
- Python 3.9+
- Node.js 18+ and npm

### Recommended for model inference/training
- CUDA-capable GPU (optional but recommended)

## Quick Start

### 1) Clone and enter the repository

```bash
git clone <your-fork-or-repo-url>
cd AcousticSpace-Deepfake-Detection
```

### 2) Start backend (FastAPI + model)

```bash
cd aasist
python -m venv .venv
source .venv/bin/activate        # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

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

License information for the AASIST module is available in `/aasist/LICENSE`.
