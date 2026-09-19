def merge_intervals(intervals):
    if not intervals: return []
    result=[sorted(intervals)[0][:]]
    for s,e in sorted(intervals)[1:]:
        if s<=result[-1][1]: result[-1][1]=max(result[-1][1],e)
        else: result.append([s,e])
    return result

if __name__ == "__main__": print(merge_intervals([[1,3],[2,6],[8,10],[15,18]]))
