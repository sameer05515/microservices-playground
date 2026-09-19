def activity_selection(activities):
    activities = sorted(activities, key=lambda x: x[1])
    selected, last_end = [], float("-inf")
    for start, end in activities:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    return selected

if __name__ == "__main__":
    print(activity_selection([(1,2),(3,4),(0,6),(5,7),(8,9),(5,9)]))
