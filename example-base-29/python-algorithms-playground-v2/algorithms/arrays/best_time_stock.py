def max_profit(prices):
    min_price = float("inf")
    best = 0
    for price in prices:
        min_price = min(min_price, price)
        best = max(best, price - min_price)
    return best

if __name__ == "__main__":
    print(max_profit([7,1,5,3,6,4]))
