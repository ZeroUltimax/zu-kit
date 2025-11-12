export {
  all,
  awaited,
  fail,
  failChecked,
  isFail,
  isSucc,
  iter,
  map,
  mapElse,
  mapFail,
  mapOr,
  res,
  throwing,
  throwingAsync,
  tryify,
  trying,
} from "../core/index.ts";
export type { Failure, Result, Success } from "../type.ts";
export { and, andThen, or, orElse } from "./combine.ts";
export { get, getChecked, getElse, getFail, getFailChecked, getOr } from "./get.ts";
