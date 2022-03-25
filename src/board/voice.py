import urllib3
import base64
import speech_recognition as sr
import json
import playsound
from gtts import gTTS
import pyttsx3
from io import BytesIO
import os
# import wavio
import numpy as np
import pygame
import time
import requests

# import musicplayer
# class Song:
#     def __init__(self, f):
#         self.f = f
#     def readPacket(self, size):
#         return self.f.read(size)
#     def seekRaw(self, offset, whence):
#         self.f.seek(offset, whence)
#         return self.f.tell()

def speak_directly(text):
    start = time.time()
    tts = gTTS(text=text, lang='ko')
    fp = BytesIO()
    tts.write_to_fp(fp)
    fp.seek(0)
    
    pygame.mixer.music.load(fp)
    pygame.mixer.music.play()
    while pygame.mixer.music.get_busy() == True:
        continue
    end = time.time()
    print(end-start)

def speak(text):
    start = time.time()
    tts = gTTS(text=text, lang='ko')
    filename = "abc.mp3"
    tts.save(filename)
    pygame.mixer.init()

    pygame.mixer.music.load(filename)
    pygame.mixer.music.play()
    os.remove(filename)
    end = time.time()
    print(end-start)


def get_speech():
    # 마이크에서 음성을 추출하는 객체
    recognizer = sr.Recognizer()

    # 마이크 설정
    microphone = sr.Microphone(sample_rate=16000)

    # 마이크 소음 수치 반영
    with microphone as source:
        recognizer.adjust_for_ambient_noise(source)
        print("소음 수치 반영하여 음성을 청취합니다. {}".format(recognizer.energy_threshold))

    # 음성 수집
    with microphone as source:
        print("Say something!")
        result = recognizer.listen(source)
        audio = result.get_raw_data()
    print(type(audio), len(audio))

    return audio


openApiURL = ""
accessKey = ""
languageCode = "korean"

# engine = pyttsx3.init()
pygame.mixer.init()
while True:
    #speak_directly("부르셨나요?")
    # speak_file("부르셨나요?")
    audioContents = get_speech()
    audioContents = base64.b64encode(audioContents).decode("utf8")
    requestJson = {
        "access_key": accessKey,
        "argument": {
            "language_code": languageCode,
            "audio": audioContents
        }
    }

    http = urllib3.PoolManager()
    response = http.request(
        "POST",
        openApiURL,
        headers={"Content-Type": "application/json; charset=UTF-8"},
        body=json.dumps(requestJson)
    )

    word = json.loads(response.data.decode("utf-8")
                      )['return_object']['recognized']
    word = word.replace(" ", "")
    print(word)
    if "시리" in word:
        pygame.mixer.init()

        pygame.mixer.music.load("call_resp.mp3")
        pygame.mixer.music.play()
        
        audioContents = get_speech()
        audioContents = base64.b64encode(audioContents).decode("utf8")
        requestJson = {
            "access_key": accessKey,
            "argument": {
                "language_code": languageCode,
                "audio": audioContents
            }
        }

        http = urllib3.PoolManager()
        response = http.request(
            "POST",
            openApiURL,
            headers={"Content-Type": "application/json; charset=UTF-8"},
            body=json.dumps(requestJson)
        )
        word = json.loads(response.data.decode("utf-8")
                      )['return_object']['recognized']
        resp = requests.post("", data = word.encode('utf-8'))
        speak(resp.text)