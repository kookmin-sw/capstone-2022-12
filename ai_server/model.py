import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset
from transformers import AutoModel
from transformers import PreTrainedTokenizerFast, GPT2LMHeadModel

U_TKN = '<usr>'
S_TKN = '<sys>'
BOS = '</s>'
EOS = '</s>'
MASK = '<unused0>'
SENT = '<unused1>'
PAD = '<pad>'


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
