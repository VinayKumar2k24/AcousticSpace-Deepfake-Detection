# 🎙️ AcousticSpace – AI-Powered Deepfake Voice Detection

> **An AI-powered audio forensic and deepfake voice detection system using AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks), acoustic analysis, and Room Impulse Response (RIR) analysis.**

---

## 📌 Project Overview

**AcousticSpace** is an AI-powered **Deepfake Voice Detection and Audio Forensics platform** designed to analyze speech/audio recordings and determine whether the input is:

- 🟢 **Genuine / Bonafide Speech**
- 🔴 **Spoofed / Deepfake Speech**

The core detection system is based on the **AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks)** deep learning architecture.

In addition to deepfake classification, AcousticSpace provides an acoustic analysis workflow that includes:

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

The project is structured as a modular full-stack application with a **Python/FastAPI AI backend** and a **React + TypeScript frontend**.

---

# 🎯 Project Objectives

The primary objectives of AcousticSpace are:

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

---

# ✨ Key Features

## 🤖 AI-Based Deepfake Voice Detection

AcousticSpace uses the **AASIST** anti-spoofing architecture to analyze speech/audio recordings.

The system is designed to distinguish between:

```text
Genuine / Bonafide Speech
             vs.
Spoofed / Deepfake Speech