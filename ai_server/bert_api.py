import logging
import os

import torch
import transformers
from transformers import AutoTokenizer
from ts.torch_handler.base_handler import BaseHandler

from model import EmotionClassifier

LOGGER = logging.getLogger(__name__)
LOGGER.info("Transformers version %s", transformers.__version__)


class KlueTextClassifierHandler(BaseHandler):
    def __init__(self):
        super().__init__()
        self.initialized = False
        self.classes = ['기쁨', '불안', '슬픔', '분노']

    def initialize(self, context):
        self.manifest = context.manifest
        properties = context.system_properties
        model_dir = properties.get("model_dir")
        serialized_file = self.manifest["model"]["serializedFile"]
        model_pt_path = os.path.join(model_dir, serialized_file)

        self.tokenizer = AutoTokenizer.from_pretrained("klue/bert-base", use_fast=True)
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model = EmotionClassifier()
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
                token_ids = self.tokenizer.encode(input_text)
                input_ids = torch.tensor(token_ids).unsqueeze(dim=0).to(self.device)
                attention_mask = torch.tensor([1] * len(input_ids)).unsqueeze(dim=0).to(self.device)

                if input_ids.shape is not None:
                    if input_ids_batch is None:
                        input_ids_batch = input_ids
                        attention_mask_batch = attention_mask
                    else:
                        input_ids_batch = torch.cat([input_ids_batch, input_ids], dim=0)
                        attention_mask_batch = torch.cat([attention_mask_batch, attention_mask], dim=0)
            return input_ids_batch, attention_mask_batch

    def inference(self, input_batch):
        with torch.inference_mode():
            input_ids_batch, attention_mask_batch = input_batch
            inferences = []
            outputs = self.model(input_ids_batch, attention_mask_batch)
            print("This the output size for inference output from the emotion classification model", outputs.size())

            num_rows = outputs.shape[0]
            for i in range(num_rows):
                class_id = torch.argmax(outputs[i])
                prediction = self.classes[int(class_id.item())]
                inferences.append(prediction)
            return inferences

    def postprocess(self, inference_output):
        return inference_output
