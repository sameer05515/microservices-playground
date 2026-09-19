def is_anagram_sorting(a, b):
    return sorted(a.replace(" ", "").lower()) == sorted(b.replace(" ", "").lower())

def is_anagram_hashmap(a, b):
    a, b = a.replace(" ", "").lower(), b.replace(" ", "").lower()
    if len(a) != len(b):
        return False
    freq = {}
    for ch in a:
        freq[ch] = freq.get(ch, 0) + 1
    for ch in b:
        if ch not in freq:
            return False
        freq[ch] -= 1
        if freq[ch] < 0:
            return False
    return True

def is_anagram_frequency_array(a, b):
    a, b = a.replace(" ", "").lower(), b.replace(" ", "").lower()
    if len(a) != len(b):
        return False
    freq = [0] * 256
    for x, y in zip(a, b):
        freq[ord(x)] += 1
        freq[ord(y)] -= 1
    return all(x == 0 for x in freq)

if __name__ == "__main__":
    print(is_anagram_sorting("listen", "silent"))
    print(is_anagram_hashmap("listen", "silent"))
    print(is_anagram_frequency_array("listen", "silent"))
