// Hodges' exact two-sample KS test algorithm (Smirnov distribution)
// Reference: Hodges, J.L. Jr., "The Significance Probability of the Smirnov Two-Sample Test," Arkiv fiur Matematik, 3, No. 43 (1958), 469-486.

export function ksHodgesExact(sampleA: number[], sampleB: number[]): { statistic: number; pValue: number } {
  const a = sampleA.slice().sort((x, y) => x - y);
  const b = sampleB.slice().sort((x, y) => x - y);
  const nA = a.length;
  const nB = b.length;

  // Compute ECDFs at all points in the pooled sample
  const pooled = a.concat(b).sort((x, y) => x - y);
  const cdfA = new Array(pooled.length).fill(0);
  const cdfB = new Array(pooled.length).fill(0);
  let iA = 0,
    iB = 0;
  for (let i = 0; i < pooled.length; i++) {
    while (iA < nA && a[iA] <= pooled[i]) iA++;
    while (iB < nB && b[iB] <= pooled[i]) iB++;
    cdfA[i] = iA / nA;
    cdfB[i] = iB / nB;
  }

  // KS statistic: max absolute difference
  let maxDiff = 0;
  for (let i = 0; i < pooled.length; i++) {
    const diff = Math.abs(cdfA[i] - cdfB[i]);
    if (diff > maxDiff) maxDiff = diff;
  }

  // DP for exact p-value
  function factorialBigInt(n: number): bigint {
    let res = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
      res *= i;
    }
    return res;
  }
  function binomBigInt(n: number, k: number): bigint {
    return factorialBigInt(n) / (factorialBigInt(k) * factorialBigInt(n - k));
  }
  function hodgesExactDP(nA: number, nB: number, d: number): number {
    // DP table: dp[i][j] = # of paths to (i, j) without exceeding d
    const dp: bigint[][] = Array.from({ length: nA + 1 }, () => Array(nB + 1).fill(0n));
    dp[0][0] = 1n;
    for (let i = 0; i <= nA; i++) {
      for (let j = 0; j <= nB; j++) {
        if (i === 0 && j === 0) continue;
        let ways = 0n;
        // Hodges recurrence: |i/nA - j/nB| <= d
        // |i * nB - j * nA| <= Math.round(d * nA * nB)
        const threshold = Math.round(d * nA * nB);
        if (i > 0 && Math.abs(i * nB - j * nA) <= threshold) ways += dp[i - 1][j];
        if (j > 0 && Math.abs(i * nB - j * nA) <= threshold) ways += dp[i][j - 1];
        dp[i][j] = ways;
      }
    }
    const validPaths = dp[nA][nB];
    const totalPaths = binomBigInt(nA + nB, nA);
    return 1 - Number(validPaths) / Number(totalPaths);
  }

  const pValue = hodgesExactDP(nA, nB, maxDiff);
  return { statistic: maxDiff, pValue };
}
