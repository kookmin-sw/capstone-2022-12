import logging
import os

import torch
import torch.nn as nn
import torchvision.models
import transformers
from transformers import AutoModel, AutoTokenizer
from ts.torch_handler.base_handler import BaseHandler

LOGGER = logging.getLogger(__name__)
LOGGER.info("Transformers version %s", transformers.__version__)


class FusionClassifier(nn.Module):
    def __init__(self):
        super(FusionClassifier, self).__init__()
        self.tokenizer = AutoTokenizer.from_pretrained("klue/bert-base", use_fast=True)

        self.bert = AutoModel.from_pretrained("klue/bert-base")
        for param in self.bert.parameters():
            param.requires_grad = True

        self.conv = nn.Conv2d(1, 3, 3, 1, 1)
        self.resnet = torchvision.models.resnet50(pretrained=True)
        self.classifier = nn.Linear(768, 1)
        self.sigmoid = nn.Sigmoid()

    def forward(self, text, img):
        token_ids = self.tokenizer.encode(text)
        input_ids = torch.tensor(token_ids).unsqueeze(dim=0).to(self.device)
        attention_mask = torch.tensor([1] * len(input_ids)).unsqueeze(dim=0).to(self.device)

        x1 = self.bert(token_ids, attention_mask).pooler_output
        x2 = self.conv(img)
        x2 = self.resnet(x2)
        x = torch.cat([x1, x2], dim=1)
        x = self.classifier(x)
        out = self.sigmoid(x)
        return out


class NLUHandler(BaseHandler):
    def __init__(self):
        super(NLUHandler, self).__init__()
        self.initialized = False
        self.device = None
        self.model = None

    def initialize(self, context):
        self.manifest = context.manifest
        properties = context.system_properties
        model_dir = properties.get("model_dir")
        serialized_file = self.manifest["model"]["serializedFile"]
        model_pt_path = os.path.join(model_dir, serialized_file)

        self.tokenizer = AutoTokenizer.from_pretrained("klue/bert-base", use_fast=True)

        self.model = FusionClassifier()
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.eval()
        self.model.to(self.device)
        self.initialized = True
        LOGGER.info(f"Transformer model from path {model_dir} loaded successfully")

    def preprocess(self, requests):
        with torch.inference_mode():
            input_ids_batch, attention_mask_batch = None, None
            for idx, data in enumerate(requests):
                input_text = data.get("data")
                if input_text is None:
                    input_text = data.get("body")
                if isinstance(input_text, (bytes, bytearray)):
                    input_text = input_text.decode("utf-8")

                LOGGER.info("Received text: %s", input_text)
            return input_text

    def inference(self, input_batch):
        with torch.inference_mode():
            inferences = []
            outputs = self.model(input_batch)

            print("This the output size for inference output from the emotion classification model", outputs.size())
            num_rows = outputs.shape[0]
            for i in range(num_rows):
                pred = torch.argmax(outputs[i])
                if pred > 0.5:
                    pred = 1
                else:
                    pred = 0
                inferences.append(pred)
            return inferences

    def postprocess(self, inference_output):
        return inference_output
