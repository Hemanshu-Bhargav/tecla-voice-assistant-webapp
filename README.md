# tecla-voice-assistant-webapp
Node.js web app, which spawns Python processes, to automate and enhance the training process of Snowboy's Wake Word Engine.

This web application allows users to create customized wake words using Snowboy found [here](https://github.com/Kitt-AI/snowboy).
Wake words are phrases which "wake up" a service, such as a voice assistant, similar to the phrase "Ok Google" for Google Home.
This repository was created for research purposes, with Inclusive Design in mind. The goal of this Graphical User Interface (GUI) is to add an easy-to-use platform
which automates speech recognition, makes voiced/unvoiced decisions on recording samples and serves as a personal voice assistant for users with accessibility needs. 

To run: create an entry point for your folder using ```npm init``` and then run ```npm install```.

Hardware/Software requirements:
- Linux Distribution or MacOS supported by Snowboy
- Raspberry Pi
- Snowboy (download [here](https://github.com/Kitt-AI/snowboy))
- Nodejs 
- Microphone capable of recording at frequncies of 16hz (most USB microphones will work)
- Port 3000 should not be preoccupied

This project used messaging queue tools to exchange data between a desktop computer or mobile phone and a raspberry pir. That functionality is not present in this repository.
