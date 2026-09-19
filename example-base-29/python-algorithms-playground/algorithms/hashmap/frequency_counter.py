def frequency_counter(values):
    frequency = {}
    for value in values:
        frequency[value] = frequency.get(value, 0) + 1
    return frequency

if __name__ == "__main__":
    print(frequency_counter(["a", "b", "a", "c", "b", "a"]))
