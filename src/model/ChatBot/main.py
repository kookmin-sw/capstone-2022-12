import torch
from AE.AE_Bank import *
import BERT_ChatBot_Model as ChatBot

def main():
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model = ChatBot.BERT_ChatBot(dim=64, batch_size=512, device=device)
    model.to(device)

    model.Chat()
    #
    # torch.save(model.state_dict(), "BERT_ChatBot_state_dict.pt")
    # torch.save(model, "BERT_ChatBot.pt")


    # device = 'cuda' if torch.cuda.is_available() else 'cpu'
    # model = ChatBot.BERT_ChatBot(dim=64, batch_size=512, device=device)
    # model.load_state_dict(torch.load('BERT_ChatBot_state_dict.pt'))
    # # model = torch.load('BERT_ChatBot.pt')
    # model.to(device)
    #
    # model.Chat()

if __name__ == "__main__":
    main()