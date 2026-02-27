import { Command } from "commander";

import { cmdTrial } from "./cmdTrial/index.ts";
import { cmdVariant } from "./cmdVariant.ts";

// const experimentsDir = "__experiments__";
// const resultsDir = ".perf-results";

// const calibrate = new Command("calibrate")
//   .description("Calibrate iterations counts for every test.")
//   .option(
//     "-e, --experiment [ID or Name]",
//     "Calibrate only the specified experiment.",
//   )
//   .option(
//     "-t, --target <number>",
//     `\
// Target duration, in milliseconds.
// A higher target duration will result in more accurate samples, but the trial runs will take longer to complete.`,
//     "100",
//   )
//   .addHelpText(
//     "after",
//     `\
// This will run each experiment:test combination with successively higher iteration counts, until the fastest sample takes at least the target duration.
// The resulting iteration counts will be saved and used to run the trials.
// `,
//   );

// const trial = new Command("trial")
//   .description("Run a single experimental trial.")
//   .argument("<experiment>", "which experiment to run, by ID or Name")
//   .option("-u, --uid [string]", "unique identifier for this trial run")
//   .option(
//     "-s, --samples [number]",
//     "how many samples to collect per test:variant case",
//     "100",
//   )
//   .option(
//     "-o, --output [file]",
//     "Output file to write results to. If not specified, results will be written to .perf-results/<uid>.json",
//   )
//   .addHelpText(
//     "after",
//     `\
// Run an experiment trial. The experiment driver will run through every possible test:variant case.
// For each combination in turn, it will spawn a child process that executes the "sample" command, which will run the actual test.
// `,
//   );

// const report = new Command("report").description(
//   "Start the report server to view trial results.",
// );

new Command().addCommand(cmdTrial).addCommand(cmdVariant).parse(process.argv);
