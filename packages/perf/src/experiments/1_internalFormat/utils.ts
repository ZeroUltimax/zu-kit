map: (r: SUCC_TYPE | FAIL_TYPE, proj: (s: SUCC_VAL) => SUCC_VAL) =>
  SUCC_TYPE | FAIL_TYPE;
andThen: (
  a: SUCC_TYPE | FAIL_TYPE,
  b: (s: SUCC_VAL) => SUCC_TYPE | FAIL_TYPE,
) => SUCC_TYPE | FAIL_TYPE;
orElse: (a: SUCC_TYPE | FAIL_TYPE, b: (f: FAIL_VAL) => SUCC_TYPE | FAIL_TYPE) =>
  SUCC_TYPE | FAIL_TYPE;

function map<S, F, T>(r: Result<S, F>, proj: (s: S) => T): Result<T, F> {
  if (isFail(r)) return r;
  return succ(proj(get(r)));
}

function andThen<S, F, T, G>(
  a: Result<S, F>,
  b: (s: S) => Result<T, G>,
): Result<T, F | G> {
  if (isFail(a)) return a;
  return b(get(a));
}

function orElse<S, F, T, G>(
  a: Result<S, F>,
  b: (f: F) => Result<T, G>,
): Result<S | T, G> {
  if (isSucc(a)) return a;
  return b(getFail(a));
}
