from collections import Counter

def character_frequency(s):
    return dict(Counter(s))

if __name__ == "__main__":
    print(character_frequency("programming"))
