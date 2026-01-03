def longest_unique_substring(s):
    left=best=0; seen={}
    for right,ch in enumerate(s):
        if ch in seen and seen[ch]>=left: left=seen[ch]+1
        seen[ch]=right; best=max(best,right-left+1)
    return best

if __name__ == "__main__": print(longest_unique_substring('abcabcbb'))
