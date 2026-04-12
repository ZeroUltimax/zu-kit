import { ksHodgesExact } from "./ksHodges.ts";
import data from "./ksTestData.json" with { type: "json" };

const { diffA, diffB } = data;

console.log("\nDifferent distributions:");
const result2 = ksHodgesExact(diffA, diffB);
console.log("KS Test statistic:", result2.statistic);
console.log("KS Test p-value:", result2.pValue);
