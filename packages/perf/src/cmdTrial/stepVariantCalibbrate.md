# Determining the Optimal Iterations ($I$)

To find $I$, we need to measure the system noise floor. OS noise (context switches, interrupts) isn't constant, but it has a "minimum resolution." If your test run is shorter than the typical OS scheduling quantum or the variance of a cache miss, the noise will dominate.

The Algorithm: The "Coefficient of Variation" (CV) Sweep

1. Baseline Test: Pick one variant (usually the fastest or a "null" variant).
2. Sweep $I$: Run the test with increasing powers of 10 for $I$ (e.g., $10^3, 10^4, 10^5, \dots$).
3. Measure CV: For each $I$, take 10 samples and calculate the Coefficient of Variation:
   $$CV = \frac{\sigma}{\mu} = \frac{\text{Standard Deviation}}{\text{Mean}}$$
4. The Elbow Point: As $I$ increases, $CV$ will drop sharply and then plateau.
   - If $I$ is too low, $CV$ is high (noise dominates).
   - If $I$ is high enough, $CV$ stabilizes (only the "intrinsic" variance remains).
5. Stopping Rule for $I$: Pick the smallest $I$ where $CV < \epsilon$ (usually 0.01 or 1%).
