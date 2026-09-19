def majority_element(nums):
    candidate, count = None, 0
    for value in nums:
        if count == 0:
            candidate = value
        count += 1 if value == candidate else -1
    return candidate

if __name__ == "__main__":
    print(majority_element([2,2,1,1,1,2,2]))
