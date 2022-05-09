import sys
from os import system
from sys import argv

def main(args):
    # build NLU handler
    print("\nbuild NLU model archive\n")
    system("torch-model-archiver --model-name nlu --version 1.0 --extra-files stub.py --handler nlu_api.py --force")
    system("mv nlu.mar ./model_store")
    # build NLG handler
    print("\nbuild NLG model archive\n")
    system("torch-model-archiver --model-name nlg --version 1.0  --extra-files stub.py --handler nlg_api.py --force")
    system("mv nlg.mar ./model_store")

    if len(args) == 2 and args[1] == "start":
        print("\nservice start\n")
        system("torchserve --ts-config ./config.properties")
    else:
        print("build finished.")


if __name__ == '__main__':
    main(sys.argv)
