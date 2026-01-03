def integer_sqrt(n):
    if n < 0: raise ValueError("n must be non-negative")
    left,right,ans=0,n,0
    while left<=right:
        mid=(left+right)//2
        if mid*mid<=n: ans=mid; left=mid+1
        else: right=mid-1
    return ans

if __name__ == "__main__": print(integer_sqrt(17))
