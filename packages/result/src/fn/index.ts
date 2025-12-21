export {
  all,
  awaited,
  fail,
  failChecked,
  isFail,
  isSucc,
  iter,
  res,
  resultify,
  resulting,
  succ,
  throwing,
  throwingAsync,
} from "../core/index.ts";
export type { Failure, Result, Success } from "../type.ts";
export { and, andThen, or, orElse } from "./combine.ts";
export { get, getChecked, getElse, getFail, getFailChecked, getOr } from "./get.ts";
export { map, mapElse, mapFail, mapOr } from "./map.ts";
