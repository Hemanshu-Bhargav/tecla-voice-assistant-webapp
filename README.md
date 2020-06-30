# tecla-voice-assistant-webapp
Node.js Webapp which spawns Python processes to automate training process of Snowboy Wake Word Engine

Web service which allows users to create customized wake words using Snowboy found [here](https://github.com/Kitt-AI/snowboy).
Wake words are phrases which "wake up" the voice assistant, such as "Ok Google".
Web service adds a graphical user interface to the training process, so users are welcomed with an easy-to-use set-up process. 

To run: create an entry point for your folder using ```npm init``` and then run ```npm install```.

Hardware/Software requirements:
- Linux Distribution or MacOS supported by Snowboy
- Microphone capable of recording at frequncies of 16hz (most USB microphones will work)
- Port 3000 should not be preoccupied
