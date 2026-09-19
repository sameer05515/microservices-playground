def can_jump(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True

if __name__ == "__main__":
    print(can_jump([2,3,1,1,4]))
