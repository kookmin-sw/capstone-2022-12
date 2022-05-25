import logging
import os

import torch
import transformers
from ts.torch_handler.base_handler import BaseHandler
import numpy as np

from stub import FusionClassifier

LOGGER = logging.getLogger(__name__)
LOGGER.info("Transformers version %s", transformers.__version__)


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

        self.model = FusionClassifier()
        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model.load_state_dict(torch.load('./fusionTrained.pt'))
        self.model.eval()
        self.model.to(self.device)
        self.initialized = True
        LOGGER.info(f"Transformer model from path {model_dir} loaded successfully")

    def preprocess(self, requests):
        for idx, data in enumerate(requests):
            input_data = data.get("data")
            if input_data is None:
                input_data = data.get("body")
            input_text = input_data['text']
            input_img = np.array(input_data['img'])
            LOGGER.info("Received text: %s", input_text)
            LOGGER.info("Received img shape: %s", input_img.shape)
        return [input_text, input_img]

    def inference(self, input_batch, **kwargs):
        input_text, input_img = input_batch
        with torch.inference_mode():
            inferences = []
            outputs = self.model(input_text, input_img)
            num_rows = outputs.shape[0]
            for i in range(num_rows):
                LOGGER.info(f"prediction output {outputs[i]}")
                pred = outputs[i].item()
                if pred > 0.5:
                    pred = 1
                else:
                    pred = 0
                inferences.append(pred)
            return inferences

    def postprocess(self, inference_output):
        result = inference_output
        return result
