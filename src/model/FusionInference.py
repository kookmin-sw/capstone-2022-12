import os
import pandas as pd
import numpy as np

import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

from PIL import Image
from torchvision import transforms
import torchvision
from tqdm import tqdm, tqdm_notebook
import sys
from einops import repeat
from transformers import AutoModel, AutoTokenizer

class BERTEmotionClassifier(nn.Module):
  def __init__(self, num_classes = 1):
    super(BERTEmotionClassifier, self).__init__()
    self.bert = AutoModel.from_pretrained("klue/bert-base")
    for param in self.bert.parameters():
      param.requires_grad = True
    #for param in self.bert.encoder.layer[11].parameters():
    #  param.requires_grad = True
    #self.bert.pooler.dense.requires_grad = True
    #self.bert.requires_grad = True
    self.classifier = nn.Linear(768, 1)
    self.sigmoid = nn.Sigmoid()

  def forward(self, input_ids, attention_mask):
    x = self.bert(input_ids, attention_mask).pooler_output
    x = self.sigmoid(self.classifier(x))
    return x

class EmotionClassifier(nn.Module):
  def __init__(self, num_classes = 1):
    super(EmotionClassifier, self).__init__()
    self.resnet = torchvision.models.resnet50(pretrained = True)
    self.resnet.fc = nn.Linear(self.resnet.fc.in_features, 768)
    self.sigmoid = nn.Sigmoid()
    self.conv = nn.Conv2d(1, 3, 3, 1, 1)

    self.bert = BERTEmotionClassifier().cuda()
    #self.bert.load_state_dict(torch.load('path for weight of bert'))
    self.bert = self.bert.bert

    self.classifier = nn.Linear(768 * 2, 1)

  def forward(self, x, token_ids, attention_mask):
    x1 = self.bert(token_ids, attention_mask).pooler_output
    x2 = self.conv(x)
    x2 = self.resnet(x2)
    x = torch.cat([x1, x2], dim = 1)
    x = self.sigmoid(self.classifier(x))
    return x

# Service를 위한 코드
class Chat():
  def __init__(self):
    self.model = EmotionClassifier().cuda()
    self.model.load_state_dict(torch.load("path for weight of fusion"))
    self.tokenizer = AutoTokenizer.from_pretrained("klue/bert-base", use_fast = True)
    self.classes = ['슬프지않음', '슬픔']
    self.transform = transforms.Compose(
    [transforms.ToTensor(),
     transforms.Resize((128,256))]
    )

  def chat(self, x, text):
    self.model.eval()
    token_ids = self.tokenizer.encode(text)
    x = self.model(self.transform(x).unsqueeze(dim=0).cuda(), torch.tensor(token_ids).unsqueeze(dim=0).cuda(), torch.tensor([1] * len(token_ids)).unsqueeze(dim=0).cuda())
    if x > 0.5:
      return self.classes[1]
    return self.classes[0]