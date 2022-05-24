import logging
import os

import torch
import transformers
from ts.torch_handler.base_handler import BaseHandler

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
        self.model.eval()
        self.model.to(self.device)
        self.initialized = True
        LOGGER.info(f"Transformer model from path {model_dir} loaded successfully")

    def preprocess(self, requests):
        for idx, data in enumerate(requests):
            input_text = data.get("data")
            if input_text is None:
                input_text = data.get("body")
            if isinstance(input_text, (bytes, bytearray)):
                input_text = input_text.decode("utf-8")

            LOGGER.info("Received text: %s", input_text)
        return input_text

    def inference(self, input_batch, **kwargs):
        with torch.inference_mode():
            inferences = []
            outputs = self.model(input_batch)
            num_rows = outputs.shape[0]
            for i in range(num_rows):
                pred = torch.argmax(outputs[i])
                if pred > 0.5:
                    pred = 1
                else:
                    pred = 0
                inferences.append(pred)
            return inferences, input_batch

    def postprocess(self, inference_output):
        result, text = inference_output
        return result, text
