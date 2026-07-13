# AcousticSpace-Deepfake-Detection

An AI-powered Deepfake Voice Detection system using the **AASIST (Audio Anti-Spoofing using Integrated Spectro-Temporal Graph Attention Networks)** model to classify **Genuine** and **Spoofed** speech using Room Impulse Response (RIR) features.

---

## Overview

This project is designed to detect AI-generated or spoofed voices by leveraging the AASIST deep learning architecture. It provides a FastAPI-based backend for inference and includes pre-trained models, configuration files, evaluation scripts, and prediction utilities.

---

## Features

- Deepfake Voice Detection
- AASIST Deep Learning Model
- FastAPI Backend
- PyTorch Implementation
- Pre-trained Weights Included
- Configuration Files
- Evaluation Metrics
- Prediction API

---

## Project Structure

```
AcousticSpace-Deepfake-Detection
│
├── aasist
│   ├── config
│   ├── exp_result
│   ├── models
│   ├── app.py
│   ├── main.py
│   ├── predict.py
│   ├── evaluation.py
│   ├── download_dataset.py
│   ├── data_utils.py
│   ├── utils.py
│   ├── requirements.txt
│   └── README.md
│
└── README.md
```

---

## Technologies Used

- Python
- PyTorch
- FastAPI
- NumPy
- Librosa
- SoundFile
- AASIST Architecture

---

## Installation

Clone the repository

```bash
git clone https://github.com/VinayKumar2k24/AcousticSpace-Deepfake-Detection.git
```

Go to the project directory

```bash
cd AcousticSpace-Deepfake-Detection
```

Install dependencies

```bash
pip install -r aasist/requirements.txt
```

---

## Run the Project

Run the FastAPI server

```bash
python aasist/app.py
```

or

```bash
python aasist/main.py
```

---

## Model

This project uses the **AASIST** model for Deepfake Voice Detection.

The repository contains:

- Pre-trained model weights
- Configuration files
- Evaluation scripts
- Prediction scripts

---

## Results

The trained model can classify audio samples into:

- Genuine Voice
- Spoofed Voice

---

## Future Improvements

- Web Interface
- Docker Deployment
- Real-Time Audio Detection
- REST API Enhancements
- Model Optimization

---

## Author

**Vinay Kumar**

BE in Artificial Intelligence and Machine Learning

Ballari Institute of Technology and Management

GitHub: https://github.com/VinayKumar2k24

---

## License

This project is licensed under the MIT License.
