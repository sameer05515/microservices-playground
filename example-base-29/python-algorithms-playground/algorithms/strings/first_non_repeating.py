from collections import Counter

def first_non_repeating(s):
    counts = Counter(s)
    for ch in s:
        if counts[ch] == 1:
            return ch
    return None

if __name__ == "__main__":
    print(first_non_repeating("swiss"))
