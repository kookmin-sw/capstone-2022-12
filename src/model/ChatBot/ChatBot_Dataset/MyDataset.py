import torch
import pandas as pd
from torch.utils.data import DataLoader, Dataset


class MyDataset(Dataset):
    def __init__(self, csv_path):
        super(MyDataset, self).__init__()

        strtotensor = lambda x: list(map(float, x[1:-1].split(",")))

        self.data = pd.read_csv(csv_path)
        self.data["embedding"] = self.data["embedding"].map(strtotensor)

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        x = torch.FloatTensor(self.data["embedding"][idx])
        return x

    def get_answer(self, idx=0):
        answer = self.data["A"][idx]
        return answer


def main():
    pass


if __name__ == "__main__":
    main()