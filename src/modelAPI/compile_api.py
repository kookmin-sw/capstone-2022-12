import sys
from os import system
from sys import argv


def main(args):
    # build nlu handler
    print("\nbuild nlu model archive\n")
    system(
        "torch-model-archiver --model-name nlu_api --version 1.0 --serialized-file nlu.pt --extra-files model.py stub.py dataset_64.csv --handler nlu_api.py --force")
    system("mv nlu_api.mar ./model_store")
    # build nlg handler
    print("\nbuild nlg model archive\n")
    system(
        "torch-model-archiver --model-name nlg_api --version 1.0 --serialized-file nlg.pt --extra-files model.py --handler nlg_api.py --force")
    system("mv nlg_api.mar ./model_store")

    if len(args) == 2 and args[1] == "start":
        print("\nservice start\n")
        system("torchserve --ts-config ./config.properties")
    else:
        print("build finished.")


if __name__ == '__main__':
    main(sys.argv)
