import { spawn } from "node:child_process";

const { argv, execArgv, execPath } = process;
const commonArgs = [
  ...execArgv, // Repeat whatever node args were used to start the current process (e.g., --inspect)
  "--expose-gc", // Required for the child process to perform garbage collection between samples
  argv[1]!, // The script being executed (e.g., perf.js)
  ".variant", // The .variant command
];

export async function obtainSamples(
  experimentId: string,
  testId: string,
  variantId: string,
  samplesCount: number,
  iters: number,
): Promise<number[]> {
  const args: string[] = [experimentId, testId, variantId, samplesCount.toString(), iters.toString()];

  // .variant returns the samples as a JSON array of numbers via process.send()
  const child = spawn(execPath, [...commonArgs, ...args], {
    stdio: ["ignore", "ignore", "ignore", "ipc"],
  });

  const samples = await new Promise<number[]>((resolve, reject) => {
    child.on("message", (message) => {
      if (Array.isArray(message) && message.every((item) => typeof item === "number")) {
        resolve(message);
      } else {
        reject(new Error(`Unexpected message from child process: ${message}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });

    child.on("exit", (code) => {
      if (code === 0) return;
      reject(new Error(`Child process exited with code ${code}`));
    });
  });

  return samples;
}
