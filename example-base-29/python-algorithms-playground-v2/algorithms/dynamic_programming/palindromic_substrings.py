def count_palindromic_substrings(s):
    count=0
    def expand(l,r):
        nonlocal count
        while l>=0 and r<len(s) and s[l]==s[r]: count+=1; l-=1; r+=1
    for i in range(len(s)): expand(i,i); expand(i,i+1)
    return count
if __name__ == "__main__": print(count_palindromic_substrings('aaa'))
