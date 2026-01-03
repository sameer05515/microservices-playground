def longest_palindrome(s):
    best=''
    def expand(l,r):
        while l>=0 and r<len(s) and s[l]==s[r]: l-=1; r+=1
        return s[l+1:r]
    for i in range(len(s)):
        for p in (expand(i,i),expand(i,i+1)):
            if len(p)>len(best): best=p
    return best

if __name__ == "__main__": print(longest_palindrome('babad'))
