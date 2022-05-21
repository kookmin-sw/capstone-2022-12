### 1. 프로젝트 소개

#### 프로젝트 이름: `AID`<br>

독거노인 포함 1인 가구와 대화를 통해 감정상태를 파악하고 우울증 이상 소견을 감지하여 보호자에게 미리 통지하는 서비스입니다.

#### 프로젝트 소개
최근 IoT기술이 돌봄 서비스에서도 활용되고 있다. 대표적인 예로 KT의 IoT 기반 위치 트래커, 안심 LED 솔루션, 그리고 TV 시청 형태를 통한 모니터링 시스템이 있다. 하지만, 이는 모두 독거 노인의 정신적 건강을 모니터링하는 서비스가 아닌 독거 노인의 위치 파악을 통한 신체적 건강 모니터링을 주로 집중하고 있다. 즉, **IoT기술의 활용을 통해서 많은 독거 노인이 혜택을 누릴 수 있게 되었지만, 감정 및 정신적 건강 모니터링에 집중하지 않아 정작 가장 중요한 조기발견은 어렵다는 한계점**을 가진다.<br>
우울증은 조기에 발견되면, 정신과 질환 중에서 가장 치료가 잘 되는 질환 중의 하나이므로 빠른 발견과 적절한 치료를 받는다면  대다수의 사람들이 정상적인 일상으로 회복할 수 있다.<br>
따라서 **우리는 1인 가구(특히 독거노인) 인원의 감정상태를 모니터링하여 우울증을 조기에 발견하고 빠르게 치료할 수 있도록 돕는 서비스를 소개**한다.

#### Abstract 
Recently, IoT technology is also being used in care services. Representative examples include KT's IoT-based location tracker, safe LED solution, and monitoring system through TV viewing. However, all of these are not services that monitor the mental health of the elderly living alone, but mainly focus on physical health monitoring through location identification of the elderly living alone. In other words, **The use of IoT technology has enabled many elderly people living alone to enjoy benefits, but it is difficult to detect the most important early because they do not focus on emotional and mental health monitoring.**<br>
Depression is one of the most well-treated psychiatric diseases if detected early, so the majority of people can recover to their normal daily lives with quick detection and proper treatment.<br>
Therefore, **We introduce services that monitor the emotional state of single-person households (especially the elderly living alone) to help detect and treat depression early.**

### 2. 소개 영상
[![AID 소개영상](https://user-images.githubusercontent.com/28241676/169647658-7b90d7d7-db92-49a3-8969-9ad81a0b9b78.png)](https://youtu.be/Tgn2YCNgPzI)

### 3. 시연영상
[![AID 시연영상](https://user-images.githubusercontent.com/28241676/161486795-f2f56b56-9951-4642-97c2-e13fcf37c5c0.png)](https://youtu.be/rp1SJ38i_wI)

### 4. 문서
+ 중간 보고서
  + [LINK](https://github.com/kookmin-sw/capstone-2022-12/blob/master/docs/%ED%8C%8012-%EC%A4%91%EA%B0%84%EB%B3%B4%EA%B3%A0%EC%84%9C.pdf)
+ 중간 발표자료
  + [LINK](https://github.com/kookmin-sw/capstone-2022-12/blob/master/docs/%ED%8C%8012-%EC%A4%91%EA%B0%84%EB%B0%9C%ED%91%9C%EC%9E%90%EB%A3%8C.pdf)
+ 결과 보고서
  + 추가 예정
+ 최종 발표자료
  + 추가 예정
+ 최종 보고서
  + 추가 예정

### 4. 시스템 구성
![KakaoTalk_20220404_123604826](https://user-images.githubusercontent.com/28241676/161470384-fdd1ca6d-78a4-44cb-ada1-420356924ffc.png)<br>
사용자의 음성을 스피커를 통해 입력받습니다. 음성은 텍스트로 변환되어 AI서버에 전송됩니다. AI 서버에서는 텍스트의 감정을 분석하고 이에 맞는 응답을 return 합니다. return 받은 응답은 스피커에서 음성합성을 통해 출력됩니다.<br>
AI서버에 텍스트를 받은 후 감정 분석까지 완료되면 Web 서버의 DB에 저장됩니다. 2주간의 대화 목록에서 우울의 감정 비율이 특정 Threshold 이상 감지되면 회원 가입시 등록된 보호자 혹은 기관 관계자에게 알림을 주어 적절한 치료를 받을 수 있도록 설계했습니다.

#### 모델
##### 감정분류 모델(BERT+ResNet)
+ Model Architecture 
  + ![감정분류 모델 Architecture](https://user-images.githubusercontent.com/28241676/169647189-833a96ca-8522-4c4e-b815-00edd807dd37.png)
+ Model Inference
  + ![감정분류모델 Inference](https://user-images.githubusercontent.com/28241676/169647405-29ad49fa-6b6f-4ba5-8b3f-6f7a129fb1dc.gif)
+ Performance Table
  + ![감정분류 모델 성능 테이블](https://user-images.githubusercontent.com/28241676/169647343-ec61f68e-ce83-4d4c-87db-858aecce2046.png)
##### 문장출력 모델(S-BERT Based ChatBot)
+ Model Architecture
  + ![문장출력 모델 Architecture](https://user-images.githubusercontent.com/28241676/169647285-933bb81b-fcdc-43cb-8187-8eb2b547ca8e.png)
+ Model Inference
  + ![문장출력 모델 Inference](https://user-images.githubusercontent.com/28241676/169647391-b9c80489-f164-4829-a2c7-8627c77175d4.gif)
+ Performance Table
  + ![문장출력 모델 성능 테이블](https://user-images.githubusercontent.com/28241676/169647356-942a6527-2b10-42cc-adee-2871c285e057.png)


### 5. 로드맵
현재(2022-04-08) 진행사항입니다.
![KakaoTalk_20220404_123625753](https://user-images.githubusercontent.com/28241676/161553779-f6d7ea59-85c3-43f0-9d5f-6ba8d7f6746d.png)

### 6. 팀 소개
* 장민혁
  * Role : Backend and Board
  * Student ID : 1691
  * E-Mail : wkdalsgur85@kookmin.ac.kr
  * Github : https://github.com/min-hyuk98
* 조상연
  * Role : Model Training and Backend
  * Student ID : 1706
  * E-Mail : whtkddus98@kookmin.ac.kr
  * Github : https://github.com/JoSangYeon
* 허진우
  * Role : Frontend and Model API
  * Student ID : 1721
  * E-Mail : fffuro@kookmin.ac.kr
  * Github : https://github.com/hideonhouse
* 황교민
  * Role : Model Training and Board
  * Student ID : 1724
  * E-Mail : piter0208@kookmin.ac.kr
  * Github : https://github.com/KyominHwang

### 7. 사용법

소스코드제출시 설치법이나 사용법을 작성하세요.

### 8. 기타

추가적인 내용은 자유롭게 작성하세요.

### Support or Contact

readme 파일 생성에 추가적인 도움이 필요하면 [도움말](https://help.github.com/articles/about-readmes/) 이나 [contact support](https://github.com/contact) 을 이용하세요.
