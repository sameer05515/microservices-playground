def count_inversions(arr):
    def sort(a):
        if len(a)<=1: return a,0
        m=len(a)//2; l,x=sort(a[:m]); r,y=sort(a[m:]); i=j=inv=0; out=[]
        inv=x+y
        while i<len(l) and j<len(r):
            if l[i]<=r[j]: out.append(l[i]); i+=1
            else: out.append(r[j]); j+=1; inv+=len(l)-i
        return out+l[i:]+r[j:],inv
    return sort(arr)[1]

if __name__ == "__main__": print(count_inversions([1,20,6,4,5]))
