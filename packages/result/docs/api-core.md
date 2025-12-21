# Result API - Core Concepts

Welcome! I created `zu-res` after having to deal with ad-hoc and untyped error handling in TypeScript project for years. I wanted something useful, type-safe, and ergonomic that could help me write clear and maintainable code.

This documentation will go over the core APIs and available for working with `Result` types, and hopefully give you some ideas on how to use them effectively in your own projects.

## Understanding the Result Type

A `Result<S, F>` lets you represent the outcome of an operation: either a success (`Success<S>`) with a value of type `S`, or a failure (`Failure<F>`) with an error of type `F`. This pattern is great for handling errors in a predictable and type-safe way, which is nigh-impossible with traditional exception-based error handling.

### Success Type

A `Success<S>` represents a successful outcome of an operation, containing a value of type `S`. In practice, this means that your function completed normally and returned a value `S`.

> If your operation succeeds but doesn’t need to return a value, you can use `null` for the success type `S`.

### Failure Type

A `Failure<F>` represents an outcome where an operation has failed, usually due to an error in an external system or invalid input. This would perviously be handled by throwing exceptions. Instead, the failure is captured in a `Failure<F>` object containing an error value of type `F`.

This is where the `Result` pattern shines, as it gives you the exact type of the error, allowing you to handle it appropriately without resorting to untyped exceptions. It also clearly documents the possible failure modes of your functions.

> The type of your failures aren't limited to `Error` objects. You can create custom error types, return strings, errors codes, or any other type that makes sense for your application.
> The only limitation on failure types is that it cannot be `null` or `undefined`. This is an implementation detail that is necessary to distinguish between success and failure results when created with `res()`. Though, what does it really mean to have a null failure? If your operation cannot fail, why even use a `Result` type?

### Overloaded API Functions

Many API functions are overloaded to work with both `Success` and `Failure` directly. This helps keep your types precise and avoids unnecessary type widening.

```typescript
const success42 = succ(42); // Success(42)
const failureA = fail("Error A"); // Failure("Error A")
const result99 = res<number, string>(99, null);

function double(n) {
  return n * 2;
}

function allCaps(s: string): string {
  return s.toUpperCase();
}

// mapElse knowns that success42 is Success<number>, so the result will come from invoking `double`
mapElse(success42, double, allCaps); // result type inferred number

// mapElse knowns that failureA is Failure<string>, so the result will come from invoking `allCaps`
mapElse(failureA, double, allCaps); // result type inferred string

// mapElse does not know if result99 is Success<number> or Failure<string>, so the result is either a number or a string
mapElse(result99, double, allCaps); // result type inferred number | string
```

### How the Result Pattern Works

A `Result<S, F>` is just a union of two types: `Success<S>` and `Failure<F>`. The API gives you tools to create, check, read, transform, and chain results in a type-safe way.

While you could manually create `Success` and `Failure` objects, it’s best to use the provided factory functions. Not only will this keep your code consistent, but it also lets the `zu-res` library evolve without breaking your usage.

- Factory functions ensure objects are created in a predictable way, which can help JavaScript engines optimize your code.
- They also allow the internal structure of `Success` and `Failure` to change safely in future versions.

# API Details

## Creating Results

You can create a `Result` using one of several factory functions, depending on whether you want to represent a success, a failure, or a generic outcome.

### Creating a Success Result

When your operation succeeds, use the `succ(s: S): Success` function to wrap the value in a `Success` type.

```typescript
function multiply(a: number, b: number): Success<number> {
  return succ(a * b);
}
```

### Creating a Failure Result

If your operation fails, use the `fail(f: NonNullable<F>): Failure` function to wrap the error value in a `Failure` type.

```typescript
function dislike(a: number): Failure<string> {
  return fail(`I don't like the number ${a}`);
}
```

If the type of your failure is nullable (for example, `string | null | undefined`), but you know at runtime that the value is not `null` or `undefined`, use the `failChecked(f: F): Failure` function to safely discard the `null | undefined` part of the the type and create a safe failure result.

> Using `failChecked` with a value that is actually `null` or `undefined` will lead to runtime errors, so use it only when you are certain of the value.

### Creating a Result from Values

Sometimes, you may not know in advance whether you have a success or a failure. In these cases, use the `res(s: S | null, f: F | null)` function to create a `Result<S | null, F>` from either a success value `s` or a failure value `f`.

- If both `s` and `f` are non-nullable, the failure value `f` takes precedence.
- If both `s` and `f` are nullable, the result is a `Success<null|undefined>`. If you do not want `null|undefined` in your success type, manually check the result and use the explicit `succ` or `fail` factory functions instead.

## Checking Result Types

To determine whether a `Result` is a `Success` or a `Failure`, use the provided type guard functions:

- `isSucc(r: Result): r is Success` returns `true` if the result is a success.
- `isFail(r: Result): r is Failure` returns `true` if the result is a failure.

These type guards create an explicit type assertion, allowing TypeScript to precisely infer whether the result is a success or a failure. This enables you to safely use functions that are specific to each case, such as `get` for successes and `getFail` for failures, without type errors or unsafe casts.

```typescript
function handleResult<S, F>(r: Result<S, F>): void {
  if (isSucc(r)) {
    // r is now typed as Success<S>
    console.log("Success:", get(r));
  } else if (isFail(r)) {
    // r is now typed as Failure<F>
    console.log("Failure:", getFail(r));
  }
}
```

## Accessing Values from Results

To access the value inside a `Result`, use one of the following functions based on your situation. Avoid directly accessing the internal properties of `Success` and `Failure` objects, as these are considered implementation details and may change in future versions.

### Extracting Values from Known Results

If you already know you have a `Success` or `Failure` (for example, after using a type guard), use:

- `get(s: Success): S` to extract the success value.
- `getFail(f: Failure): NonNullable<F>` to extract the failure value.

```typescript
const success = succ(42);
const failure = fail("Some Error");

get(success); // 42
get(failure); // TypeScript Error: Cannot get value from a Failure Result

getFail(success); // TypeScript Error: Cannot get failure value from a Success Result
getFail(failure); // "Some Error"
```

If you are certain a `Result` is a `Success` or `Failure`, but TypeScript cannot infer it, use:

- `getChecked(s: Result<S, unknown>): S` for a success value.
- `getFailChecked(f: Result<unknown, F>): NonNullable<F>` for a failure value.

> These functions will throw a runtime error if the `Result` is not of the expected type. Use them only when you are sure.

```typescript
const success = succ(42);
const failure = fail("Some Error");

getChecked(success); // 42
getChecked(failure); // Throws TypeError at runtime

getFailChecked(success); // Throws TypeError at runtime
getFailChecked(failure); // "Some Error"
```

### Providing Default Values

If you want to get the success value, or provide a fallback in case of failure, use:

- `getOr(r: Result, def: DS): S | DS` to use a constant default value.
- `getElse(r: Result, defFn: (f: F) => DS): S | DS` to use a function that derives the default value from the failure.

```typescript
const success = succ(42);
const failure = fail("Some Error");

getOr(success, 99); // 42
getOr(failure, 99); // 99

getElse(success, (f) => f.length); // 42
getElse(failure, (f) => f.length); // 10 ( "Some Error".length )
```

## Transforming Result Values

You can transform the value inside a `Result` using the following functions, depending on whether you want to operate on a success or a failure.

### Transforming Success Values

Often, you want to modify the value inside a successful result without touching failures. The `map(r: Result, proj: (s: S) => T): Result<T, F>` function lets you do exactly that, applying a transformation only if the result is a success.

- If the result is a `Success`, this applies the function `proj` to the success value and returns a new `Result` with the transformed value.
- If the result is a `Failure`, it is returned unchanged.

### Transforming Failure Values

Sometimes, you want to handle or reformat errors without affecting successful results. The `mapFail(r: Result, projFail: (f: NonNullable<F>) => NonNullable<G>): Result<S, G>` function allows you to transform the failure value only when the result is a failure, leaving successes untouched.

- If the result is a `Failure`, this applies the function `projFail` to the failure value and returns a new `Result` with the transformed error.
- If the result is a `Success`, it is returned unchanged.

```typescript
const success = succ(42);
const failure = fail("Some Error");

const addOne = (x: number) => x + 1;
const lowerCase = (s: string) => s.toLowerCase();

map(success, addOne); // Success(43)
map(failure, addOne); // Failure("Some Error")

mapFail(success, lowerCase); // Success(42)
mapFail(failure, lowerCase); // Failure("some error")
```

### Transforming and Extracting Values

Sometimes, you want to transform a result and immediately extract a plain value rather than getting back another `Result`. This is useful when you want to finish your error handling and move on with a regular value, whether the operation succeeded or failed.

If you want to provide a simple default value in case of failure, use `mapOr(r: Result, proj: (s: S) => T, def: U): T | U`.

- If the result is a `Success`, it returns the transformed value.
- If it’s a `Failure`, it returns the provided default.

If you want to derive a value from the failure in case of an error, use `mapElse(r: Result, proj: (s: S) => T, projFail: (f: F) => G): T | G` .

- If the result is a `Success`, it returns the transformed value.
- If it’s a `Failure`, it calls `projFail` to produce a value from the error.

These functions are especially handy at the end of a chain of operations, when you want to convert a `Result` into a value you can use directly.

```typescript
const success = succ(42);
const failure = fail("Some Error");

const addOne = (x: number) => x + 1;
const getLength = (s: string) => s.length;

mapOr(success, addOne, 99); // 43
mapOr(failure, addOne, 99); // 99

mapElse(success, addOne, getLength); // 43
mapElse(failure, addOne, getLength); // 10
```

## Composing and Chaining Result Operations

A major strength of the `Result` pattern is how easily you can combine and chain operations that might fail, all while keeping your code type-safe and readable. The following functions help you build up more complex logic from simple results.

### Combining Results

When you have the result of two operations and want to combine them, you have two main options depending on how you want to handle the combination of successes and failures.

If you want a success only when both operations succeed, use `and(a: Result, b: Result): Result`.

- If both `a` and `b` are successes, it will return the second success `b`.
- Otherwise, it will return the first failure of the two.

If you want a success as long as at least one operation succeeds, use `or(a: Result, b: Result): Result`.

- If both `a` and `b` are failures, it will return the last failure `b`.
- Otherwise, it will return the first success of the two.

```typescript
const success42 = succ(42);
const success99 = succ(99);

const failureA = fail("Error A");
const failureB = fail("Error B");

and(success42, success99); // Success(99)
and(failureA, success99); // Failure("Error A")
and(success42, failureB); // Failure("Error B")
and(failureA, failureB); // Failure("Error A")

or(success42, success99); // Success(42)
or(failureA, success99); // Success(99)
or(success42, failureB); // Success(42)
or(failureA, failureB); // Failure("Error B")
```

### Chaining Dependent Result Operations

When you have a sequence of operations where each step depends on the previous one succeeding, you can chain them without manual checks. Just like with combining results, there are two main functions you can use, depending on how you want to handle success and failure cases.

If you want to continue operating on the success value, use the `andThen(r: Result, fn: (s: S) => Result<T, F>): Result<T, F>` function.

- If the result is a `Success`, it will invoke `fn` with the success value and return the resulting `Result`.
- If the result is a `Failure`, it will return the failure unchanged.

If you want to provide an alternative operation in case of failure, use the `orElse(r: Result, fn: (f: F) => Result<S, G>): Result<S, G>` function.

- If the result is a `Success`, it will return the success unchanged.
- If the result is a `Failure`, it will invoke `fn` with the failure value and return the resulting `Result`.

> In their raw form, `andThen` and `orElse` look clunky to use, but their utility comes through when used in their functional or object form, when you can chain multiple calls together.
> It lets you write code that flows naturally, without a mess of if-else blocks.

```typescript
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return fail("Division by zero");
  return succ(a / b);
}

function sqrt(x: number): Result<number, string> {
  if (x < 0) return fail("Square root of negative number");
  return succ(Math.sqrt(x));
}

function defaultZero(err: string): Success<number> {
  console.log(`Error encountered: ${err}.`);
  return succ(0);
}

andThen(divide(10, 2), sqrt); // Success(√5)
andThen(divide(10, 0), sqrt); // Failure("Division by zero")
andThen(divide(10, -2), sqrt); // Failure("Square root of negative number")

orElse(divide(10, 2), defaultZero); // Success(5)
orElse(divide(10, 0), defaultZero); // Error encountered: Division by zero. => Success(0)
orElse(divide(10, -2), defaultZero); // Error encountered: Square root of negative number. => Success(0)
```

## Integrating Results with Real-World Code

The `Result` type is designed to fit naturally into real-world TypeScript code, not just isolated functions. This section shows how you can use results with common JavaScript and TypeScript constructs, like arrays, iterators, promises, exceptions, and try-catch patterns. By using these patterns, it becomes much easier to make `Result` a natural part of your everyday code.

### Working with Arrays of Results

When you have an array of results, you’ll often want to combine them into a single result. The `all(results: Result<S, F>[]): Result<S[], F>` function does exactly this.

- If every item is a `Success`, you get a `Success` containing an array of all the values.
- Otherwise, you get the first `Failure` encountered.

This pattern is useful for validating or processing a batch of items, where you want to succeed only if everything worked.

> The `all` function is overloaded to preserve as much type information as possible. If you pass an array of known `Success` or `Failure` results, the returned type will reflect that.

```typescript
const success42 = succ(42);
const success99 = succ(99);

const failureA = fail("Error A");
const failureB = fail("Error B");

all([success42, success99]); // Success([42, 99])
all([success42, failureA, success99]); // Failure("Error A")
all([failureA, failureB]); // Failure("Error A")
```

### Using for...of for Conditional Success Handling

The `iter(r: Result<S, F>): Iterable<S>` function lets you work directly with the success value of a result, using a `for...of` loop, without needing to manually check or unpack it first.

- If the result is a `Success`, the loop runs once with the success value.
- If the result is a `Failure`, the loop does not run at all.

This makes it easy to write code that operates on the success value in place, and simply does nothing if the result was a failure.

> If this feels strange... That's because it is! We're hacking the iterable protocol to transform a for...of loop into a conditional expression. I rarely use this pattern, but it's handy for quick, inline success handling without extra boilerplate.

```typescript
const success42 = succ(42);

const failureA = fail("Error A");

for (const value of iter(success42)) {
  console.log("Success value:", value); // Success value: 42
}

for (const _value of iter(failureA)) {
  console.log("This will not be logged");
}
```

### Integrating Results with Promises

When working with asynchronous code, you will often end up with a result that contains a promise only on success, `Result<Promise<S>, F>`. Usually, you want to "flip" this so you have a `Promise<Result<S, F>>`, allowing you to await the result.

The `awaited(r: Result<Promise<S>, F>): Promise<Result<S, F>>` function handles this inversion for you, leaving you with a `Promise` that you can then await.

- If the result is a `Success`, it will await the promise and return a `Promise<Success>` with the resolved value.
- Otherwise, it will return the failure unchanged, as a `Promise<Failure>`.

```typescript
async function doWork(value: number): Promise<number> {
  // Simulate async some work
  return value * value;
}

function attemptWork(value: number): Result<Promise<number>, string> {
  if (value < 0) {
    return fail("Negative value provided");
  }
  return succ(doWork(value));
}

await awaited(attemptWork(5)); // Success(25)
await awaited(attemptWork(-3)); // Failure("Negative value provided");
```

### Converting Results to Exceptions

While the `Result` type is designed to help you avoid exceptions, sometimes you really do need to throw an error if something fails. The `throwing(r: Result<S, F>): S` function bridges the gap between result-based and exception-based error handling:

- If the result is a `Success`, it returns the success value.
- If the result is a `Failure`, it throws the failure value as an exception.

There’s also an async version, `throwingAsync(r: Result<Promise<S>, F>): Promise<S>`, which works the same way but with promises.

> Although the whole point of `Result` is to avoid exceptions, you have to admit that not everyone is going to eb on board with that idea.
> Or maybe you're using a library that expects exceptions for error handling, in which case you don't have much choice.
> It could even be that you just want to “unwrap” a result and let failures bubble up as thrown errors. I'm not judging!

```typescript
const success42 = succ(42);
const failureA = fail("Error A");

try {
  const value1 = throwing(success42); // 42
} catch (e) {
  // This block is not run
}

try {
  const _ = throwing(failureA);
} catch (e) {
  const error2 = e; // "Error A"
}
```

### Converting Exceptions based code to Results base code

Sometimes you have code that might throw an exception, but you want to work with results instead of try/catch blocks. The `resulting(fn: () => S): Result<S, F>` function lets you wrap any function that might throw, converting it into a `Result`:

- If the function runs without throwing, you get a `Success` with the returned value.
- If the function throws, you get a `Failure` with the thrown error.

If you want to convert an entire function (not just a single call) into a result-returning version, use `resultify(fn: (...args: A) => R): (...args: A) => Result<R, F>`. This wraps the function so every call returns a `Result` instead of throwing.

> I took this idea from node's `util.promisify` function. It lets you bridge old callback-based code to make it Promise base.
> In the same vein, even though I dream of a future where everyone uses `Result` types, the current reality is that code throws exceptions. `resultify` helps you work with what you've got.

```typescript
function multiplyThenAdd(a: number, b: number, c: number): number {
  if (a < 0 || b < 0 || c < 0) throw "Negative numbers are not allowed.";
  return a * b + c;
}

resulting(() => multiplyThenAdd(2, 3, 4)); // Success(10)
resulting(() => multiplyThenAdd(-2, 3, 4)); // Failure("Negative numbers are not allowed.")

const multiplyThenAddWithResult: (
  a: number,
  b: number,
  c: number
) => Result<number, string> = resultify(multiplyThenAdd);

multiplyThenAddWithResult(5, 6, 7); // Success(37)
multiplyThenAddWithResult(5, -6, 7); // Failure("Negative numbers are not allowed.")
```
