import { Command } from "commander";

import { cmdTrial } from "./cmdTrial/index.ts";
import { cmdVariant } from "./cmdVariant.ts";

new Command().addCommand(cmdTrial).addCommand(cmdVariant).parse(process.argv);
