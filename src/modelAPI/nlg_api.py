import logging
import os

import torch
import torch.nn as nn
import transformers
from sentence_transformers import SentenceTransformer
from torch.utils.data import DataLoader
from ts.torch_handler.base_handler import BaseHandler

from stub import MyDataset, AE

LOGGER = logging.getLogger(__name__)
LOGGER.info("Transformers version %s", transformers.__version__)


def get_max(sim, prev_max):
    v, i = torch.max(sim, dim=-1)
    if prev_max < v.item():
        return v.item(), i.item()
    else:
        return prev_max, -1


class NLUHandler(BaseHandler):
    def __init__(self):
        super(NLUHandler, self).__init__()
        self.initialized = False

        self.device = None
        self.dataset = None
        self.dataloader = None

        self.model = None
        self.ae = None
        self.cos = None

    def initialize(self, context):
        self.manifest = context.manifest
        properties = context.system_properties
        model_dir = properties.get("model_dir")
        serialized_file = self.manifest["model"]["serializedFile"]
        model_pt_path = os.path.join(model_dir, serialized_file)

        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.dataset = MyDataset(f"{os.curdir}{os.sep}dataset_64{os.extsep}csv")
        self.data_loader = DataLoader(self.dataset, batch_size=512)
        self.model = SentenceTransformer('jhgan/ko-sroberta-multitask')
        self.ae = AE()
        self.ae.load_state_dict(torch.load('./AE64_state_dict.pt'))
        self.cos = nn.CosineSimilarity(dim=-1)

        self.model.eval()
        self.ae.eval()
        self.ae.to(self.device)
        self.model.to(self.device)

        self.initialized = True
        LOGGER.info(f"Transformer model from path {model_dir} loaded successfully")

    def preprocess(self, requests):
        with torch.inference_mode():
            for idx, data in enumerate(requests):
                input_text = data.get("data")
                if input_text is None:
                    input_text = data.get("body")
                if isinstance(input_text, (bytes, bytearray)):
                    input_text = input_text.decode("utf-8")

                LOGGER.info("Received text: %s", input_text)
            return input_text

    def inference(self, input_text, **kwargs):
        with torch.inference_mode():
            inferences = []
            embed = self.model.encode(input_text)
            embed = torch.tensor(embed).view(1, -1)
            embed = embed.to(self.device)
            embed = self.ae.encode(embed)

            max_sim = 0
            max_idx = 0
            for batch_idx, data in enumerate(self.data_loader):
                data = data.to(self.device)
                batch_sim = self.cos(embed, data)
                max_sim, idx = get_max(batch_sim, max_sim)
                if idx == -1:
                    continue
                else:
                    max_idx = batch_idx * self.data_loader.batch_size + idx
            ret = self.dataset.get_answer(max_idx)
            inferences.append(ret)

            return inferences

    def postprocess(self, inference_output):
        return inference_output
