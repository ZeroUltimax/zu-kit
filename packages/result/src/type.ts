export interface Success<S> {
  readonly succ: S;
  readonly fail: null;
}

export interface Failure<F> {
  readonly succ: null;
  readonly fail: NonNullable<F>;
}

export type Result<S, F> = Success<S> | Failure<F>;
