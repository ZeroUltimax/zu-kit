import * as fs from "node:fs";
import * as path from "node:path";

import type { TrialData } from "./types.ts";

let first = true;

const LATEST_PATH = path.resolve(".perf-results/latest.json");
export async function loadTrial(): Promise<TrialData> {
  if (first) {
    first = false;
    return {};
  }
  try {
    await fs.promises.access(LATEST_PATH, fs.constants.F_OK);
    const data = await fs.promises.readFile(LATEST_PATH, "utf-8");
    return JSON.parse(data) as TrialData;
  } catch (_) {
    return {};
  }
}

export async function saveTrial(trial: TrialData): Promise<void> {
  await fs.promises.mkdir(path.dirname(LATEST_PATH), { recursive: true });
  await fs.promises.writeFile(LATEST_PATH, JSON.stringify(trial, null, 2), "utf-8");
}
