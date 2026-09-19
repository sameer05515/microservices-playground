def can_complete_circuit(gas,cost):
    if sum(gas)<sum(cost): return -1
    start=tank=0
    for i in range(len(gas)):
        tank+=gas[i]-cost[i]
        if tank<0: start=i+1; tank=0
    return start
if __name__ == "__main__": print(can_complete_circuit([1,2,3,4,5],[3,4,5,1,2]))
