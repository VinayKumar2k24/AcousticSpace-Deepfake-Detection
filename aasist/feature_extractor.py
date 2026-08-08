import os
import librosa
import librosa.display
import matplotlib.pyplot as plt
import numpy as np

def load_audio(audio_path):
    """
    Load audio using Librosa.
    Converts to mono and resamples to 16 kHz.
    """
    audio, sr = librosa.load(audio_path, sr=16000, mono=True)

    return audio, sr

def create_output_folder():
    """
    Create a folder to store extracted feature images.
    """
    output_dir = "feature_outputs"

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    return output_dir

def save_waveform(audio, sr, output_dir):
    """
    Save waveform image.
    """

    plt.figure(figsize=(12,4))

    librosa.display.waveshow(audio, sr=sr)

    plt.title("Waveform")

    plt.xlabel("Time")

    plt.ylabel("Amplitude")

    waveform_path = os.path.join(output_dir, "waveform.png")

    plt.savefig(waveform_path)

    plt.close()

    return waveform_path

def save_mel_spectrogram(audio, sr, output_dir):
    """
    Generate and save Mel Spectrogram.
    """

    mel = librosa.feature.melspectrogram(
        y=audio,
        sr=sr,
        n_mels=128
    )

    mel_db = librosa.power_to_db(mel, ref=np.max)

    plt.figure(figsize=(12,4))

    librosa.display.specshow(
        mel_db,
        sr=sr,
        x_axis="time",
        y_axis="mel"
    )

    plt.colorbar(format="%+2.0f dB")

    plt.title("Mel Spectrogram")

    mel_path = os.path.join(output_dir, "mel_spectrogram.png")

    plt.savefig(mel_path)

    plt.close()

    return mel_path

def save_mfcc(audio, sr, output_dir):
    """
    Generate and save MFCC feature image.
    """

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=20
    )

    plt.figure(figsize=(12,4))

    librosa.display.specshow(
        mfcc,
        x_axis="time",
        sr=sr
    )

    plt.colorbar()

    plt.title("MFCC Features")

    mfcc_path = os.path.join(output_dir, "mfcc.png")

    plt.savefig(mfcc_path)

    plt.close()

    return mfcc_path

def save_spectrogram(audio, sr, output_dir):
    """
    Generate and save STFT Spectrogram.
    """

    stft = librosa.stft(audio)

    stft_db = librosa.amplitude_to_db(
        np.abs(stft),
        ref=np.max
    )

    plt.figure(figsize=(12,4))

    librosa.display.specshow(
        stft_db,
        sr=sr,
        x_axis="time",
        y_axis="log"
    )

    plt.colorbar(format="%+2.0f dB")

    plt.title("STFT Spectrogram")

    spectrogram_path = os.path.join(
        output_dir,
        "spectrogram.png"
    )

    plt.savefig(spectrogram_path)

    plt.close()

    return spectrogram_path 

def save_chroma(audio, sr, output_dir):
    """
    Generate and save Chroma Feature image.
    """

    chroma = librosa.feature.chroma_stft(
        y=audio,
        sr=sr
    )

    plt.figure(figsize=(12,4))

    librosa.display.specshow(
        chroma,
        x_axis="time",
        y_axis="chroma",
        sr=sr
    )

    plt.colorbar()

    plt.title("Chroma Features")

    chroma_path = os.path.join(
        output_dir,
        "chroma.png"
    )

    plt.savefig(chroma_path)

    plt.close()

    return chroma_path

def save_spectral_contrast(audio, sr, output_dir):
    """
    Generate and save Spectral Contrast image.
    """

    contrast = librosa.feature.spectral_contrast(
        y=audio,
        sr=sr
    )

    plt.figure(figsize=(12,4))

    librosa.display.specshow(
        contrast,
        x_axis="time",
        sr=sr
    )

    plt.colorbar()

    plt.title("Spectral Contrast")

    contrast_path = os.path.join(
        output_dir,
        "spectral_contrast.png"
    )

    plt.savefig(contrast_path)

    plt.close()

    return contrast_path

def save_rir(audio, sr, output_dir):
    """
    Approximate Room Impulse Response (RIR)
    using the audio autocorrelation.
    """

    rir = librosa.autocorrelate(audio)

    plt.figure(figsize=(12,4))

    plt.plot(rir)

    plt.title("Approximate Room Impulse Response")

    plt.xlabel("Samples")

    plt.ylabel("Amplitude")

    rir_path = os.path.join(
        output_dir,
        "rir.png"
    )

    plt.savefig(rir_path)

    plt.close()

    return rir_path

if __name__ == "__main__":

    audio_file = "sample.flac"

    audio, sr = load_audio(audio_file)

    output_dir = create_output_folder()

    save_waveform(audio, sr, output_dir)

    save_mel_spectrogram(audio, sr, output_dir)

    save_mfcc(audio, sr, output_dir)

    save_spectrogram(audio, sr, output_dir)

    save_chroma(audio, sr, output_dir)

    save_spectral_contrast(audio, sr, output_dir)

    save_rir(audio, sr, output_dir)

    print("All features extracted successfully.")

    print(f"Saved in: {output_dir}")