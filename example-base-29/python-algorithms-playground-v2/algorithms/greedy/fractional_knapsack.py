def fractional_knapsack(items, capacity):
    # items: [(weight, value), ...]
    items = sorted(items, key=lambda x: x[1] / x[0], reverse=True)
    total = 0.0
    for weight, value in items:
        if capacity == 0:
            break
        take = min(weight, capacity)
        total += take * (value / weight)
        capacity -= take
    return total

if __name__ == "__main__":
    print(fractional_knapsack([(10,60),(20,100),(30,120)], 50))
