import sys
import time
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset
from torchsummary import summary
from tqdm import notebook, tqdm
from sentence_transformers import SentenceTransformer

from AE.AE_Bank import *
from ChatBot_Dataset.MyDataset import MyDataset

def get_max(sim, maxer):
    v, i = torch.max(sim, dim=-1)
    if maxer < v.item():
        return v.item(), i.item()
    else:
        return maxer, -1


class BERT_ChatBot(nn.Module):
    def __init__(self, dim=256,
                 batch_size=512,
                 device='cuda'):
        super(BERT_ChatBot, self).__init__()

        self.embedding = 0
        self.device = device

        self.dataset = MyDataset("ChatBot_Dataset/BERT_ChatBot_Dataset_{}.csv".format(dim))
        self.data_loader = DataLoader(self.dataset, batch_size=batch_size)

        self.model = SentenceTransformer('jhgan/ko-sroberta-multitask')
        self.cos = nn.CosineSimilarity(dim=-1)

        if dim == 768:
            self.AE = nn.Sequential()
        else:
            self.AE = torch.load('AE/AE'+str(dim)+'.pt').encoder

    def set_embed(self, text):
        embed = self.model.encode(text)
        embed = torch.tensor(embed).view(1, -1).to(self.device) # (1, 768)
        embed = self.AE(embed) # (1, 768) -> (1, dim)
        self.embedding = embed

    def forward(self, x):
        similarity = self.cos(self.embedding, x) # (1, dim) 비교 (batch, dim) -> (batch,)
        return similarity # (batch,)

    def get_max(self, sim, maxer):
        v, i = torch.max(sim, dim=-1)
        if maxer < v.item():
            return v.item(), i.item()
        else:
            return maxer, -1

    def inference(self, data_loader, text):
        self.eval()
        self.set_embed(text)
        max_sim = 0
        max_idx = 0
        with torch.no_grad():
            for batch_idx, data in enumerate(data_loader):
                data = data.to(self.device)

                batch_sim = self.forward(data)  # (batch,)

                max_sim, idx = self.get_max(batch_sim, max_sim)
                if idx == -1:
                    continue
                else:
                    max_idx = batch_idx * data_loader.batch_size + idx
        answer = self.dataset.get_answer(max_idx)
        return answer, max_sim, max_idx

    def Chat(self):
        while (True):
            user = input("USER >>> ")
            if user == 'exit' or user == 'quit':
                break
            s = time.time()
            answer, sim, idx = self.inference(self.data_loader, user)
            print(" BOT >>>", answer)
            print("\t유사도 : {:.4f}%".format(sim * 100))
            e = time.time()
            print("\t\t추론 시간 :", e - s)


def main():
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = BERT_ChatBot(dim=256, batch_size=512, device=device)
    model.to(device)

    model.Chat()


if __name__ == "__main__":
    main()