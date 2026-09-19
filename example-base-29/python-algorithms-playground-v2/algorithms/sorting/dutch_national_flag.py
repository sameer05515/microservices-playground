def sort_colors(nums):
    a=nums.copy(); low=mid=0; high=len(a)-1
    while mid<=high:
        if a[mid]==0: a[low],a[mid]=a[mid],a[low]; low+=1; mid+=1
        elif a[mid]==1: mid+=1
        else: a[mid],a[high]=a[high],a[mid]; high-=1
    return a

if __name__ == "__main__": print(sort_colors([2,0,2,1,1,0]))
