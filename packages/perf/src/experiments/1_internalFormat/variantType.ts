export interface ResultFormatVariant<SUCC_VAL = any, SUCC_TYPE = any, FAIL_VAL = any, FAIL_TYPE = any> {
  succ: (v: SUCC_VAL) => SUCC_TYPE;
  fail: (v: FAIL_VAL) => FAIL_TYPE;
  isSucc: (r: SUCC_TYPE | FAIL_TYPE) => r is SUCC_TYPE;
  isFail: (r: SUCC_TYPE | FAIL_TYPE) => r is FAIL_TYPE;
  get: (s: SUCC_TYPE) => SUCC_VAL;
  getFail: (f: FAIL_TYPE) => FAIL_VAL;
  map: (r: SUCC_TYPE | FAIL_TYPE, proj: (s: SUCC_VAL) => SUCC_VAL) => SUCC_TYPE | FAIL_TYPE;
  andThen: (a: SUCC_TYPE | FAIL_TYPE, b: (s: SUCC_VAL) => SUCC_TYPE | FAIL_TYPE) => SUCC_TYPE | FAIL_TYPE;
  orElse: (a: SUCC_TYPE | FAIL_TYPE, b: (f: FAIL_VAL) => SUCC_TYPE | FAIL_TYPE) => SUCC_TYPE | FAIL_TYPE;
}

export type NumVariant<SS, FF> = ResultFormatVariant<number, SS, number, FF>;
export interface ObjSucc {
  succeeded: number;
}
export interface ObjFail {
  failed: number;
}
export type ObjVariant<SS, FF> = ResultFormatVariant<ObjSucc, SS, ObjFail, FF>;
