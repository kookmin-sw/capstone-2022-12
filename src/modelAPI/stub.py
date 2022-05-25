from torch.utils.data import Dataset
import pandas as pd
import torch
import torch.nn as nn
import torchvision.models
from torch.utils.data import Dataset
from transformers import AutoModel, AutoTokenizer
from transformers import GPT2LMHeadModel
from transformers import PreTrainedTokenizerFast

U_TKN = '<usr>'
S_TKN = '<sys>'
BOS = '</s>'
EOS = '</s>'
MASK = '<unused0>'
SENT = '<unused1>'
PAD = '<pad>'


class MyDataset(Dataset):
    def __init__(self, csv_path):
        super(MyDataset, self).__init__()

        self.data = pd.read_csv(csv_path)
        self.data["embedding"] = self.data["embedding"].map(self.__str2tensor)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        x = torch.FloatTensor(self.data["embedding"][idx])
        return x

    @staticmethod
    def __str2tensor(x):
        ret = list(map(float, x[1: -1].split(",")))
        return ret

    def get_answer(self, idx=0):
        answer = self.data["A"][idx]
        return answer


class AE(nn.Module):
    def __init__(self):
        super(AE, self).__init__()

        self.encoder = nn.Linear(768, 64)
        self.activation = nn.ReLU()
        self.decoder = nn.Linear(64, 768)

    def encode(self, x):
        return self.encoder(x)

    def forward(self, x):
        x = self.encoder(x)
        x = self.activation(x)
        out = self.decoder(x)
        return out


class EmotionClassifier(nn.Module):
    def __init__(self, num_classes=4):
        super(EmotionClassifier, self).__init__()
        self.bert = AutoModel.from_pretrained("klue/bert-base")
        self.bert.require_grad = True
        self.classifier = nn.Linear(768, num_classes)

    def forward(self, input_ids, attention_mask):
        x = self.bert(input_ids, attention_mask).pooler_output
        x = self.classifier(x)
        return x


class KoGPT2Chat(nn.Module):
    def __init__(self):
        super(KoGPT2Chat, self).__init__()
        self.neg = -1e18
        self.kogpt2 = GPT2LMHeadModel.from_pretrained('skt/kogpt2-base-v2')
        self.loss_function = torch.nn.CrossEntropyLoss(reduction='none')

    def forward(self, inputs):
        output = self.kogpt2(inputs, return_dict=True)
        return output.logits


class ChatService:
    def __init__(self):
        self.model = KoGPT2Chat().cuda()
        self.model.load_state_dict(torch.load("경로입력해주세요."))
        self.tok = PreTrainedTokenizerFast.from_pretrained("skt/kogpt2-base-v2",
                                                           bos_token=self.BOS, eos_token=self.EOS, unk_token='<unk>',
                                                           pad_token=self.PAD, mask_token=self.MASK)
        self.U_TKN = '<usr>'
        self.S_TKN = '<sys>'
        self.BOS = '</s>'
        self.EOS = '</s>'
        self.MASK = '<unused0>'
        self.SENT = '<unused1>'
        self.PAD = '<pad>'

    def chat(self, query):
        with torch.no_grad():
            a = ''
            while 1:
                input_ids = torch.LongTensor(self.tok.encode(self.U_TKN + query + self.S_TKN + a)).unsqueeze(
                    dim=0).cuda()
                pred = self.model(input_ids).cuda()
                gen = self.tok.convert_ids_to_tokens(
                    torch.argmax(
                        pred,
                        dim=-1).squeeze().cpu().numpy().tolist())[-1]
                if gen == self.EOS:
                    break
                a += gen.replace('▁', ' ')
            return a.strip()


class FusionClassifier(nn.Module):
    def __init__(self):
        super(FusionClassifier, self).__init__()
        self.tokenizer = AutoTokenizer.from_pretrained("klue/bert-base", use_fast=True)

        self.bert = AutoModel.from_pretrained("klue/bert-base")
        for param in self.bert.parameters():
            param.requires_grad = True

        self.conv = nn.Conv2d(1, 3, 3, 1, 1)
        self.resnet = torchvision.models.resnet50(pretrained=True)
        self.resnet.fc = nn.Linear(self.resnet.fc.in_features, 768)
        self.classifier = nn.Linear(768 * 2, 1)
        self.sigmoid = nn.Sigmoid()
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'

    def forward(self, text, img):
        img = torch.tensor(img, device=self.device, dtype=torch.float)
        img = img.view(-1, 1, img.shape[0], img.shape[1])
        token_ids = self.tokenizer.encode(text)
        input_ids = torch.tensor(token_ids, device=self.device, dtype=torch.long).unsqueeze(dim=0)
        attention_mask = torch.tensor([1] * len(input_ids), device=self.device, dtype=torch.float).unsqueeze(dim=0)
        x1 = self.bert(input_ids, attention_mask).pooler_output
        x2 = self.conv(img)
        x2 = self.resnet(x2)
        x = torch.cat([x1, x2], dim=1)
        x = self.classifier(x)
        out = self.sigmoid(x)
        return out
