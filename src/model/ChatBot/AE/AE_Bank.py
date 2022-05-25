import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from torch.utils.data import DataLoader, Dataset


class MyAE_256(nn.Module):
    def __init__(self):
        super(MyAE_256, self).__init__()

        self.encoder = nn.Linear(768, 256)
        self.decoder = nn.Linear(256, 768)

        self.act_fn = nn.ReLU()

    def forward(self, x):
        x = self.encoder(x)
        x = self.act_fn(x)
        x = self.decoder(x)
        return x

    def encode(self, embed):
        output = self.encoder(embed)
        return output


class MyAE_128(nn.Module):
    def __init__(self):
        super(MyAE_128, self).__init__()

        self.encoder = nn.Linear(768, 128)
        self.decoder = nn.Linear(128, 768)

        self.act_fn = nn.ReLU()

    def forward(self, x):
        x = self.encoder(x)
        x = self.act_fn(x)
        x = self.decoder(x)
        return x

    def encode(self, embed):
        output = self.encoder(embed)
        return output


class MyAE_64(nn.Module):
    def __init__(self):
        super(MyAE_64, self).__init__()

        self.encoder = nn.Linear(768, 64)
        self.decoder = nn.Linear(64, 768)

        self.act_fn = nn.ReLU()

    def forward(self, x):
        x = self.encoder(x)
        x = self.act_fn(x)
        x = self.decoder(x)
        return x

    def encode(self, embed):
        output = self.encoder(embed)
        return output


class MyAE_32(nn.Module):
    def __init__(self):
        super(MyAE_32, self).__init__()

        self.encoder = nn.Linear(768, 32)
        self.decoder = nn.Linear(32, 768)

        self.act_fn = nn.ReLU()

    def forward(self, x):
        x = self.encoder(x)
        x = self.act_fn(x)
        x = self.decoder(x)
        return x

    def encode(self, embed):
        output = self.encoder(embed)
        return output


def main():
    pass


if __name__ == "__main__":
    main()