def three_sum(nums):
    nums=sorted(nums); result=[]
    for i in range(len(nums)-2):
        if i and nums[i]==nums[i-1]: continue
        l,r=i+1,len(nums)-1
        while l<r:
            s=nums[i]+nums[l]+nums[r]
            if s==0:
                result.append([nums[i],nums[l],nums[r]]); l+=1; r-=1
                while l<r and nums[l]==nums[l-1]: l+=1
                while l<r and nums[r]==nums[r+1]: r-=1
            elif s<0: l+=1
            else: r-=1
    return result

if __name__ == "__main__": print(three_sum([-1,0,1,2,-1,-4]))
