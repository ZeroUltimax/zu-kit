import { experiments } from "../../../result/__experiments__/index.ts";
import type { TestArgs } from "./args.ts";

export async function actionTestTester({ experimentName, testName, variantName, outputFile }: TestArgs): Promise<void> {
  console.log(
    `Running test tester for experiment "${experimentName}", test "${testName}", variant "${variantName} to file "${outputFile}"`,
  );
}

// const [testIndexStr, variantIndexStr, outFile] = args;
// const testIndex = Number(testIndexStr);
// const variantIndex = Number(variantIndexStr);

// const testEntries = Object.entries(tests);
// const variantEntries = Object.entries(variants);

// const [testName, testFunc] = testEntries[testIndex];
// const [variantName, variantModule] = variantEntries[variantIndex];

// console.log(`Running test "${testName}", with variant: "${variantName}"`);

// const sampleCount = 1000;
// const benchIters = 5_000_000;

// let acc = 0;
// const iters = testIterations(variantModule, benchIters, testFunc);
// console.log("Warming up");
// for (let i = 0; i < benchIters; i++) acc = iters[i](acc);

// console.log("Benchmarking");
// const divisions = 50;
// let nextDiv = 0;

// const samples: number[] = [];
// for (let si = 0; si < sampleCount; si++) {
//   const start = performance.now();
//   for (let i = 0; i < benchIters; i++) acc = iters[i](acc);
//   const end = performance.now();
//   const duration = end - start;

//   samples.push(duration);

//   const divThreshold = (si / sampleCount) * divisions;
//   while (divThreshold >= nextDiv) {
//     console.log(`${si}/${sampleCount}`);
//     nextDiv++;
//   }
// }

// // Write samples to output file
// const outDir = path.dirname(outFile);
// await fs.mkdir(outDir, { recursive: true });
// await fs.writeFile(
//   outFile,
//   JSON.stringify({
//     testName,
//     variantName,
//     sampleCount,
//     benchIters,
//     acc,
//     samples,
//   }),
//   "utf-8",
// );
