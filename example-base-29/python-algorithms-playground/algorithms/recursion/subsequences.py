def subsequences(s):
    result = []
    def backtrack(index, path):
        if index == len(s):
            result.append("".join(path))
            return
        backtrack(index + 1, path)
        path.append(s[index])
        backtrack(index + 1, path)
        path.pop()
    backtrack(0, [])
    return result

if __name__ == "__main__":
    print(subsequences("abc"))
