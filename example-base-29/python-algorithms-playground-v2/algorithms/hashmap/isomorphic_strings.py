def is_isomorphic(s,t):
    if len(s)!=len(t): return False
    f={}; rev={}
    for a,b in zip(s,t):
        if (a in f and f[a]!=b) or (b in rev and rev[b]!=a): return False
        f[a]=b; rev[b]=a
    return True

if __name__ == "__main__": print(is_isomorphic('egg','add'))
