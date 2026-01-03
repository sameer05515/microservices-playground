def max_area(height):
    l,r,best=0,len(height)-1,0
    while l<r:
        best=max(best,min(height[l],height[r])*(r-l))
        if height[l]<height[r]: l+=1
        else: r-=1
    return best

if __name__ == "__main__": print(max_area([1,8,6,2,5,4,8,3,7]))
