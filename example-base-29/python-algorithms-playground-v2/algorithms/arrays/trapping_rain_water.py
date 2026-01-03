def trap(height):
    if not height: return 0
    l,r,lmax,rmax,water=0,len(height)-1,0,0,0
    while l<r:
        if height[l]<=height[r]:
            if height[l]>=lmax: lmax=height[l]
            else: water+=lmax-height[l]
            l+=1
        else:
            if height[r]>=rmax: rmax=height[r]
            else: water+=rmax-height[r]
            r-=1
    return water

if __name__ == "__main__": print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))
