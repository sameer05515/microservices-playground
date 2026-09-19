def can_partition(nums):
    total=sum(nums)
    if total%2: return False
    target=total//2; possible={0}
    for x in nums: possible |= {s+x for s in list(possible) if s+x<=target}
    return target in possible
if __name__ == "__main__": print(can_partition([1,5,11,5]))
