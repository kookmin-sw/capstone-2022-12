import logging
import os

import torch
import transformers
from transformers import PreTrainedTokenizerFast
from ts.torch_handler.base_handler import BaseHandler

LOGGER = logging.getLogger(__name__)
LOGGER.info(f"Transformers version {transformers.__version__}")

U_TKN = '<usr>'
S_TKN = '<sys>'
BOS = '</s>'
EOS = '</s>'
MASK = '<unused0>'
SENT = '<unused1>'
PAD = '<pad>'


class GPTHandler(BaseHandler):
    def __init__(self):
        super(GPTHandler, self).__init__()
        self.model = None
        self.tokenizer = None
        self.device = None
        self.initialized = False

    def initialize(self, context):
        self.manifest = context.manifest
        properties = context.system_properties
        model_dir = properties.get("model_dir")
        serialized_file = self.manifest["model"]["serializedFile"]
        model_pt_path = os.path.join(model_dir, serialized_file)

        self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
        self.model = KoGPT2Chat()
        self.model.load_state_dict(torch.load("gpt.pth"))
        self.model.to(self.device)
        self.model.eval()

        self.tokenizer = PreTrainedTokenizerFast.from_pretrained("skt/kogpt2-base-v2",
                                                                 bos_token=BOS, eos_token=EOS, unk_token='<unk>',
                                                                 pad_token=PAD, mask_token=MASK)

        self.initialized = True
        LOGGER.info(f"Transformer model from path {model_dir} loaded successfully")

    def preprocess(self, requests):
        with torch.inference_mode():
            input_batch = []
            for idx, data in enumerate(requests):
                input_text = data.get("data")
                if input_text is None:
                    input_text = data.get("body")
                if isinstance(input_text, (bytes, bytearray)):
                    input_text = input_text.decode("utf-8")

                LOGGER.info("Received text: %s", input_text)
                input_batch.append(input_text)
        return input_batch

    def inference(self, input_batch):
        with torch.inference_mode():
            inferences = []
            for input_text in input_batch:
                a = ''
                while True:
                    token_ids = self.tokenizer.encode(U_TKN + input_text + S_TKN + a)
                    token_ids = torch.LongTensor(token_ids).unsqueeze(dim=0).to(self.device)
                    pred = self.model(token_ids)
                    generated = torch.argmax(pred, dim=-1).squeeze().cpu().tolist()
                    generated = self.tokenizer.convert_ids_to_tokens(generated)
                    sentence = generated[-1]
                    if sentence == EOS:
                        break
                    else:
                        a += sentence.replace("_", " ")
                inferences.append(a.strip())
        return inferences

    def postprocess(self, inference_output):
        return inference_output
