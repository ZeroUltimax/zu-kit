export interface CommandArgs {
  executable: string;
  program: string;
  nodeArgs: string[];
}

const ACTIONS = ["test", "report"] as const;
export type Action = (typeof ACTIONS)[number];

export interface TestArgs {
  experimentName: string;
  testName: string;
  variantName: string;
  sampleCount: number;
  benchIters: number;
  outputFile: string;
}

export type CliTestArgs = { [K in keyof TestArgs]: TestArgs[K] | undefined };

export function getCommandArgs(): CommandArgs {
  const [executable, program] = process.argv as (string | undefined)[];
  const nodeArgs = process.execArgv;
  if (!executable) throw new Error("Executable argument is missing");
  if (!program) throw new Error("Program argument is missing");

  return { executable, program, nodeArgs };
}

export function getAction(): Action {
  const [_executable, _program, action] = process.argv as (string | undefined)[];
  if (!action) throw new Error("Action argument is missing");
  if (!ACTIONS.includes(action as Action)) throw new Error(`Invalid action: ${action}`);
  return action as Action;
}

export function getTestArgs(): CliTestArgs {
  const [
    _executable,
    _program,
    _action,
    experimentName,
    testName,
    variantName,
    sampleCountStr,
    benchItersStr,
    outputFile,
  ] = process.argv as (string | undefined)[];
  const sampleCount = sampleCountStr ? Number(sampleCountStr) : undefined;
  const benchIters = benchItersStr ? Number(benchItersStr) : undefined;
  return { experimentName, testName, variantName, sampleCount, benchIters, outputFile };
}

export function isCompleteTestArgs(args: CliTestArgs): args is TestArgs {
  return !!(
    args.experimentName &&
    args.testName &&
    args.variantName &&
    args.sampleCount &&
    args.benchIters &&
    args.outputFile
  );
}
