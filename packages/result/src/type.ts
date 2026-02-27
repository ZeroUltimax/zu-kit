export interface Success<S> {
  readonly succ: S;
}

export interface Failure<F> {
  readonly fail: NonNullable<F>;
}

export type Result<S, F> = Success<S> | Failure<F>;
