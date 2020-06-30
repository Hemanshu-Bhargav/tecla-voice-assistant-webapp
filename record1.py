import sys
import pyaudio
import wave

chunk = 1024  # Record in chunks of 1024 samples
sample_format = pyaudio.paInt16  # 16 bits per sample
channels = 2
fs = 44100  # Record at 44100 samples per second
seconds = 5; #REPLACE WITH JSON PYARG FROM FORM INPUT
filename = "1.wav"

p = pyaudio.PyAudio()  # Create an interface to PortAudio

print('Recording')

stream = p.open(format=sample_format,
                channels=channels,
                rate=fs,
                frames_per_buffer=chunk,
                input=True)

frames = []  # Initialize array to store frames

# Store data in chunks for 3 seconds
for i in range(0, int(fs / chunk * seconds)):
    data = stream.read(chunk)
    frames.append(data)

# Stop and close the stream
stream.stop_stream()
stream.close()
# Terminate the PortAudio interface
p.terminate()

print('Finished recording')
print(sys.argv[1])

# Save the recorded data as a WAV file
wf = wave.open(filename, 'wb')
wf.setnchannels(channels)
wf.setsampwidth(p.get_sample_size(sample_format))
wf.setframerate(fs)
wf.writeframes(b''.join(frames))
wf.close()

'''
#TEST OUT ZERO CROSSING MANUALLY FIRST
import librosa
y, sr = librosa.load(librosa.util.example_audio_file())
print(librosa.feature.zero_crossing_rate(y))

#If above doesn't work

from __future__ import division
from scikits.audiolab import flacread
from numpy.fft import rfft, irfft
from numpy import argmax, sqrt, mean, absolute, linspace, log10, logical_and, average, diff, correlate
from matplotlib.mlab import find
from scipy.signal import blackmanharris, fftconvolve
import time
import sys

# Faster version from http://projects.scipy.org/scipy/browser/trunk/scipy/signal/signaltools.py
# from signaltoolsmod import fftconvolve
#from parabolic import parabolic

def freq_from_crossings(sig, fs):
    """Estimate frequency by counting zero crossings

    Pros: Fast, accurate (increasing with data length).  Works well for long low-noise sines, square, triangle, etc.

    Cons: Doesn't work if there are multiple zero crossings per cycle, low-frequency baseline shift, noise, etc.

    """
    # Find all indices right before a rising-edge zero crossing
    indices = find((sig[1:] >= 0) & (sig[:-1] < 0))

    # Naive (Measures 1000.185 Hz for 1000 Hz, for instance)
    #crossings = indices

    # More accurate, using linear interpolation to find intersample
    # zero-crossings (Measures 1000.000129 Hz for 1000 Hz, for instance)
    crossings = [i - sig[i] / (sig[i+1] - sig[i]) for i in indices]

    # Some other interpolation based on neighboring points might be better. Spline, cubic, whatever

    return fs / average(diff(crossings))

###########################################if first two don't work
from __future__ import division
from numpy import logical_and, average, diff
from matplotlib.mlab import find

def freq_from_crossings(sig, fs):
    """Estimate frequency by counting zero crossings

    Doesn't work if there are multiple zero crossings per cycle.

    """
    indices = find(logical_and(sig[1:] >= 0, sig[:-1] < 0))

    # Linear interpolation to find truer zero crossings
    crossings = [i - sig[i] / (sig[i+1] - sig[i]) for i in indices]
    return fs / average(diff(crossings))
'''
