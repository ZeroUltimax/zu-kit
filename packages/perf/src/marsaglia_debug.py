import math

def factorial_bigint(n):
    res = 1
    for i in range(2, n+1):
        res *= i
    return res

def binom_bigint(n, k):
    return factorial_bigint(n) // (factorial_bigint(k) * factorial_bigint(n - k))

def marsaglia_exact_bigint(nA, nB, d):
    dp = [[0 for _ in range(nB+1)] for _ in range(nA+1)]
    dp[0][0] = 1
    threshold = round(d * nA * nB)
    for i in range(nA+1):
        for j in range(nB+1):
            if i == 0 and j == 0:
                continue
            ways = 0
            if i > 0 and abs(i * nB - j * nA) <= threshold:
                ways += dp[i-1][j]
            if j > 0 and abs(i * nB - j * nA) <= threshold:
                ways += dp[i][j-1]
            dp[i][j] = ways
    validPaths = dp[nA][nB]
    totalPaths = binom_bigint(nA + nB, nA)
    pValue = 1 - validPaths / totalPaths
    print(f"Valid paths: {validPaths}, Total paths: {totalPaths}, pValue: {pValue}")
    return pValue

# Example usage:
nA = 30
nB = 30
d = 0.26666666666666666
marsaglia_exact_bigint(nA, nB, d)
