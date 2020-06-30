import snowboydecoder
import pyaudio
import wave
import os
from os import path
import sys
import base64
import requests
import signal
import fnmatch
import findallpersonalmodels

interrupted = False

def signal_handler(signal, frame):
    global interrupted
    interrupted = True

def interrupt_callback():
    global interrupted
    return interrupted

#models =['/home/pi/snowboy/saved_model.pmdl',
#          '/home/pi/snowboy/heytecla_model.pmdl',
#          '/home/pi/snowboy/endcall_model.pmdl']
#take each matching .pmdl file
listofpmdl = []

with os.scandir('/home/pi/snowboy/examples/Python3/') as allfiles:
    for pmdlfiles in allfiles:
        if fnmatch.fnmatch(pmdlfiles, '*.pmdl'):
            listofpmdl.append(os.path.join(pmdlfiles))

models = listofpmdl
#print (models)  #print(type(models))
#for i in models:
#    print (i)

# capture SIGINT signal, e.g., Ctrl+C
signal.signal(signal.SIGINT, signal_handler)

sensitivity = [0.5]*len(models)

detector = snowboydecoder.HotwordDetector(models, sensitivity=sensitivity)

callbacks = []
for i in models:
    print (i)
    callbacks.append(lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DING))

#callbacks = [lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DING),
        #     lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DONG),
        #     lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DING),
        #     lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DING),
        #     lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DING),
        #     lambda: snowboydecoder.play_audio_file(snowboydecoder.DETECT_DING)]

# main loop
# make sure you have the same numbers of callbacks and models
print('Listening... Press Ctrl+C to exit')
detector.start(detected_callback=callbacks,
               interrupt_check=interrupt_callback,
               sleep_time=0.03)
detector.terminate()

#itworks = detection.detector.RunDetection(data)

#if itworks == 1:
#    print('Hotword Detected!')
#else:
#    print('Hotword Not Detected!')

#detector = snowboydecoder.HotwordDetector("saved_model.pmdl", sensitivity=0.5, audio_gain=1)

#detector.start(detected_callback)
