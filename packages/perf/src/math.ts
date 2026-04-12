// Kolmogorov-Smirnov test for two sample arrays
export function ksTest(sampleA: number[], sampleB: number[]): { statistic: number; pValue: number } {
  // Marsaglia's exact two-sample KS test algorithm
  const a = sampleA.slice().sort((x, y) => x - y);
  const b = sampleB.slice().sort((x, y) => x - y);
  const nA = a.length;
  const nB = b.length;
  let iA = 0;
  let iB = 0;
  let cdfA = 0;
  let cdfB = 0;
  let maxDiff = 0;
  while (iA < nA || iB < nB) {
    const valA = iA < nA ? a[iA] : Infinity;
    const valB = iB < nB ? b[iB] : Infinity;
    if (valA < valB) {
      iA++;
      cdfA = iA / nA;
    } else if (valB < valA) {
      iB++;
      cdfB = iB / nB;
    } else {
      iA++;
      iB++;
      cdfA = iA / nA;
      cdfB = iB / nB;
    }
    const diff = Math.abs(cdfA - cdfB);
    if (diff > maxDiff) maxDiff = diff;
  }

  // Marsaglia DP for exact p-value
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
  function marsagliaExactBigInt(nA: number, nB: number, d: number): number {
    // DP table: dp[i][j] = # of paths to (i, j) without exceeding d
    const dp: bigint[][] = Array.from({ length: nA + 1 }, () => Array(nB + 1).fill(0n));
    dp[0]![0]! = 1n;
    for (let i = 0; i <= nA; i++) {
      for (let j = 0; j <= nB; j++) {
        if (i === 0 && j === 0) continue;
        let ways = 0n;
        // Compare ECDFs as rationals: |i/nA - j/nB| <= d
        // |i * nB - j * nA| <= Math.round(d * nA * nB)
        const threshold = Math.round(d * nA * nB);
        if (i > 0 && Math.abs(i * nB - j * nA) <= threshold) ways += dp[i - 1][j];
        if (j > 0 && Math.abs(i * nB - j * nA) <= threshold) ways += dp[i][j - 1];
        dp[i]![j]! = ways;
      }
    }
    const validPaths = dp[nA]![nB]!;
    const totalPaths = binomBigInt(nA + nB, nA);
    console.log(`Valid paths: ${validPaths}, Total paths: ${totalPaths}`);
    // Convert to number for division
    return 1 - Number(validPaths) / Number(totalPaths);
  }

  const pValue = marsagliaExactBigInt(nA, nB, maxDiff);
  return { statistic: maxDiff, pValue };
}
