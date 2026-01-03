def minimum_platforms(arrivals,departures):
    a,d=sorted(arrivals),sorted(departures); i=j=active=best=0
    while i<len(a):
        if a[i]<=d[j]: active+=1; best=max(best,active); i+=1
        else: active-=1; j+=1
    return best
if __name__ == "__main__": print(minimum_platforms([900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000]))
