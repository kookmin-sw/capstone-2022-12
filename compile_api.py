import sys
from os import system
from sys import argv

def main(args):
    # build bert handler
    print("\nbuild bert model archive\n")
    system("torch-model-archiver --model-name bert_api --version 1.0 --serialized-file bert.pth --extra-files model.py --handler bert_api.py --force")
    system("mv bert_api.mar ./model_store")
    # build gpt handler
    print("\nbuild gpt model archive\n")
    system("torch-model-archiver --model-name gpt_api --version 1.0 --serialized-file gpt.pth --extra-files model.py --handler gpt_api.py --force")
    system("mv gpt_api.mar ./model_store")

    if len(args) == 2 and args[1] == "start":
        print("\nservice start\n")
        system("torchserve --ts-config ./config.properties")
    else:
        print("build finished.")


if __name__ == '__main__':
    main(sys.argv)
