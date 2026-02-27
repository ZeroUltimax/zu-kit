import { actionTest } from "./actionTest.ts";
import { getAction } from "./args.ts";

const action = getAction();

switch (action) {
  case "test":
    await actionTest();
    break;
  case "report":
    //  await actionReport();
    break;
}
