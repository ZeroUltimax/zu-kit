# ZeroUltimax's Result

A typescript result wrapper primitive that returns either a success or an error.

One of Typescript's greatest strengths is its type system. Yet, it cannot express the concept of operations that can fail. And sometimes, you need to know what the result of an operation is, not only when it succeeds, but also when it fails. This is where the `Result` type comes in handy. It represents either a success or a failure, allowing you to handle both cases explicitly.

The Result library provides you a simple and type-safe way to work with operations that can fail. You can create, transform, read, combine and chain results to create robust and maintainable code.

## Install

```bash
npm install zu-res
```

## Usage

```typescript
import {
  fail,
  get,
  isSucc,
  map,
  orElse,
  type Result,
  type Success,
  succ,
} from "zu-res";

// Create a result representing a division
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return fail("Division by zero");
  return succ(a / b);
}

// Map the success value to double it
function double(res: Result<number, string>): Result<number, string> {
  return map(res, (v) => v * 2);
}

// Do something in case of an error
function defaultZero(res: Result<number, string>): Success<number> {
  return orElse(res, (e) => {
    console.warn("Error handled:", e);
    return succ(0);
  });
}

// Check the result type, and do something with the success value
function logSuccess(res: Result<number, string>): void {
  if (isSucc(res)) {
    const s = get(res);
    console.log("Success:", s);
  }
}

function chain(a: number, b: number): void {
  const divided = divide(a, b);
  const doubled = double(divided);
  const defaulted = defaultZero(doubled);
  logSuccess(defaulted);
}

chain(30, 3); // 30 / 3 * 2 => Success: 20
chain(30, 0); // Error handled: Division by zero => Success: 0
```

## API

- [Core API](./docs/api-core.md)
- [Functional-style API](./docs/api-fn.md)
- [Object-style API](./docs/api-obj.md)
