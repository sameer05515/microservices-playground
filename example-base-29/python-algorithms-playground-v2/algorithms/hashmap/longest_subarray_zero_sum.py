def longest_zero_sum_subarray(nums):
    first={0:-1}; prefix=best=0
    for i,v in enumerate(nums):
        prefix+=v
        if prefix in first: best=max(best,i-first[prefix])
        else: first[prefix]=i
    return best

if __name__ == "__main__": print(longest_zero_sum_subarray([15,-2,2,-8,1,7,10,23]))
