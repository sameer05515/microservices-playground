from collections import deque
def max_sliding_window(nums,k):
    if not nums or k<=0: return []
    q=deque(); out=[]
    for i,v in enumerate(nums):
        while q and q[0]<=i-k: q.popleft()
        while q and nums[q[-1]]<=v: q.pop()
        q.append(i)
        if i>=k-1: out.append(nums[q[0]])
    return out

if __name__ == "__main__": print(max_sliding_window([1,3,-1,-3,5,3,6,7],3))
