import snowboydecoder
import pyaudio
import wave
import os
from os import path
import sys
#Below 3 are needed for training_service
import base64
import requests
import signal
#to solve utf-8 encoding issue when training using nodejs web server
import codecs

def record_and_train(storedhotword, paramgender, wakewordmodelname):

    #print (type(storedhotword))
    print (storedhotword)
    print (str(storedhotword))
    print (wakewordmodelname)
    #wakewordmodelname = unicode(wakewordmodelname)
    #wakewordmodelname = unicode(storedhotword)
    #wakewordmodelname = unicode(paramgender)
    #For webapp, need to encapsulate loop into function (that runs once). Place this function into a new file and it needs the parameters sent from here
    #then, since its return values are basically just files, which exist in the system (at each pmdl creation they are overwritten, but they do exist),
    # we should be able to access them from here. SCRATCH THAT use socket.io to create a bidirectional communication channel, since need to alert website
    #once pmdl has been created

    #NEW ADDITION: codecs.open & "rb" (to solve utf-8 encoding issue)
    def get_wave(fname):
        with codecs.open(fname, "rb") as infile:
            return base64.b64encode(infile.read())

    endpoint = "https://snowboy.kitt.ai/api/v1/train/"

    token = "REMOVED FOR SECURITY"
    hotword_name = str(storedhotword)
    language = "en"
    age_group = "20_29"
    gender = str(paramgender)
    microphone = "usb microphone"

    if __name__ == "__main__":
        try:
            wav1, wav2, wav3, out = "1.wav", "2.wav", "3.wav", wakewordmodelname
        except ValueError:
            #print ("Usage: %s wave_file1 wave_file2 wave_file3 out_model_name" % sys.argv[0])
            print("training_service executed but model creation failed")
            sys.exit()

        data = {
            "name": hotword_name,
            "language": language,
            "age_group": age_group,
            "gender": gender,
            "microphone": microphone,
            "token": token,
            "voice_samples": [
                {"wave": get_wave(wav1)},
                {"wave": get_wave(wav2)},
                {"wave": get_wave(wav3)}
            ]
        }

        response = requests.post(endpoint, json=data)
        if response.ok: #NEW ADDITION: "wb" instead of "w" to solve utf-8 issue (also unique to Python3)
            with open(out, "wb") as outfile:
                outfile.write(response.content)
            print ("Saved model to '%s'." % out)
        else:
            print ("Request failed.")
            print (response.text)
    #End of function record_and_train

storedhotword = sys.argv[1]
#print(storedhotword)
paramgender = sys.argv[2]
#print(paramgender)
#print(type(paramgender))
wakewordmodelname = sys.argv[3]
#print(wakewordmodelname)
#print(type(wakewordmodelname))
record_and_train(storedhotword, paramgender, wakewordmodelname)
print ("Your model has been saved. Please select one of the options below to register another action or exit web setup:")
