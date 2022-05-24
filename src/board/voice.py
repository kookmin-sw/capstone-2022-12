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
import vlc
import librosa
import time

min_level_db = -100

def normalize_mel(S):
    return np.clip((S-min_level_db)/-min_level_db,0,1)

def feature_extraction(data):
    S = librosa.feature.melspectrogram(y=data, n_mels=128, n_fft=512, hop_length=180)
    norm_log_S = normalize_mel(librosa.power_to_db(S, ref=np.max))
    return norm_log_S

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
    st = time.time()
    tts = gTTS(text = text, lang="ko")
    filename = "abc.mp3"
    tts.save(filename)
    pygame.mixer.init()
    pygame.mixer.music.load(filename)
    pygame.mixer.music.play()
    os.remove(filename)
    ed = time.time()
    print(ed - st)

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
        result = recognizer.listen(source, phrase_time_limit=3)
        audio = result.get_raw_data()
    print(type(audio), len(audio))

    return audio


openApiURL = ""
accessKey = ""
languageCode = "korean"

# engine = pyttsx3.init()
pygame.mixer.init()
serial = "serial10"
while True:
    #speak_directly("부르셨나요?")
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
    if "다솜" in word:
        pygame.mixer.init()
        pygame.mixer.music.load("call_resp.mp3")
        pygame.mixer.music.play()
        time.sleep(0.5)
        
        binaryAudio = get_speech()
        audioContents = base64.b64encode(binaryAudio).decode("utf8")
        binaryAudio = feature_extraction(np.array(bytearray(binaryAudio), dtype=np.float32))
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
        text = json.loads(response.data.decode("utf-8")
                      )['return_object']['recognized']
        resp = requests.post(
        "",
        json={'text':text, 'img':binaryAudio.tolist()}
        )
        chat = requests.post(
        "",text.encode('utf-8'))
        #speak(chat.text)
        #print(type(resp.text))
        #print(resp.text)
        emotion = 'depressed' if int(resp.text) != 0 else 'not_depressed'
        #print(emotion)
        requests.post("", json={"serial":serial, "talk":text, "emotion":emotion})
        
        








# def speak_trash(text):
#     start = time.time()
#     tts = gTTS(text=text, lang='ko')
#     # filename = "abc.mp3"
#     # tts.save(filename)

#     fp = BytesIO()
#     tts.write_to_fp(fp)
#     fp.seek(0)

#     pygame.mixer.init()
#     pygame.mixer.music.load(fp)
#     pygame.mixer.music.play()
#     while pygame.mixer.music.get_busy() == True:
#         continue

#     # playsound.playsound(filename)
#     # audioContents = get_speech()

#     # os.remove(filename)
#     end = time.time()
#     print(end-start)



#     # audioContents = get_speech()
#     # start = time.time()
#     # engine.say(text)
#     # engine.runAndWait()
#     # end = time.time()
#     # print(end-start)


#     # mp3_fp = BytesIO()
#     # tts = gTTS(text=text, lang='ko')
#     # tts.write_to_fp(mp3_fp)
#     # rate = 16000  # samples per second
#     # T = 3         # sample duration (seconds)
#     # f = 440.0     # sound frequency (Hz)
#     # t = np.linspace(0, T, T*rate, endpoint=False)
#     # x = np.sin(2*np.pi * f * t)
#     # wavio.write(mp3_fp, x, rate, sampwidth=3)
#     # mp3_fp.seek(0)
#     # encode_output = base64.b64encode(mp3_fp.read())