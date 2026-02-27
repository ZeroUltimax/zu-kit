import { actionTestDriver } from "./actionTestDriver.ts";
import { actionTestTester } from "./actionTestTester.ts";
import { getTestArgs, isCompleteTestArgs } from "./args.ts";

export async function actionTest(): Promise<void> {
  const testArgs = getTestArgs();

  if (isCompleteTestArgs(testArgs)) {
    return await actionTestTester(testArgs);
  } else {
    return await actionTestDriver(testArgs);
  }
}
