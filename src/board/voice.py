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

def speak(text):
    tts = gTTS(text=text, lang='ko')
    filename = "abc.mp3"
    tts.save(filename)
    playsound.playsound(filename)
    os.remove(filename)

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

while True:
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
        playsound.playsound("response.mp3")
        
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