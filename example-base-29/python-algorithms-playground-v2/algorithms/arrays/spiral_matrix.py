def spiral_order(matrix):
    if not matrix: return []
    t,b,l,r=0,len(matrix)-1,0,len(matrix[0])-1; out=[]
    while t<=b and l<=r:
        out += matrix[t][l:r+1]; t+=1
        for i in range(t,b+1): out.append(matrix[i][r])
        r-=1
        if t<=b: out += matrix[b][l:r+1][::-1]; b-=1
        if l<=r:
            for i in range(b,t-1,-1): out.append(matrix[i][l])
            l+=1
    return out

if __name__ == "__main__": print(spiral_order([[1,2,3],[4,5,6],[7,8,9]]))
