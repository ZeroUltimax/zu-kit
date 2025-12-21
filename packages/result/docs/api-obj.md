# Result API - Object Style

If you find the core API too clunky and the functional API not to your taste, there's also an object-oriented style API available. This style works a bit differently, as the methods are implemented as member functions of two Result classes, `Succ` and `Fail`. This makes it easy to chain operations directly on the result objects themselves.

> The object-oriented style has a major downside in that it is not tree-shakeable. If you use this style, the entire API will be included in your bundle, even if you only use a small part of it.

This style is available by importing from the `zu-res/obj` module.

```typescript
import { Fail, Succ } from "zu-res/obj";

const success42 = new Succ(42);
const failureA = new Fail("Error A");

function addOne(x: number) {
  return x + 1;
}

function inverse(x: number) {
  if (x === 0) {
    return new Fail("Division by zero");
  }
  return new Succ(1 / x);
}

function allCaps(s: string) {
  return new Fail(s.toUpperCase());
}

success42.map(addOne).andThen(inverse).orElse(allCaps); // Succ(1/43)
failureA.map(addOne).andThen(inverse).orElse(allCaps); // Fail("ERROR A")
```

The methods available on `Succ` and `Fail` instances correspond to core API functions, so we won't go in details here. For the full API reference, see [the core API docs](api-core.md).

## Object Oriented Concepts

The object-oriented style uses different concepts from the core and functional styles. It relies on classes and interfaces to provide a more traditional object-oriented programming experience.

The object oriented style uses different concepts from the core and functional styles. They rely on classes and interfaces to provide a more traditional object-oriented programming experience.

### The IRes interface

The secret sauce that makes the object-oriented style work is the `IRes` interface, which both `Succ` and `Fail` implement. This interface defines all the methods that can be called on result objects, allowing you to chain operations seamlessly.

You should use it as the return type of functions that return either a success or a failure, as it simplifies the returned type signature. (This was not the case in the core-style API.)

```typescript
import { Fail, type IRes, Succ } from "zu-res/obj";

function divide(a: number, b: number): IRes<number, string> {
  if (b === 0) {
    return new Fail("Division by zero");
  }
  return new Succ(a / b);
}

function sqrt(value: number): IRes<number, string> {
  if (value < 0) {
    return new Fail("Square root of negative number");
  }
  return new Succ(Math.sqrt(value));
}

divide(64, 4).andThen(sqrt); // Succ(4)
divide(64, 0).andThen(sqrt); // Fail("Division by zero")
divide(0, 99).andThen(sqrt); // Fail("Square root of negative number")
```

### The classes

Surprisingly, there is no single Result class. Instead, there are two separate classes: `Succ` for successful results and `Fail` for failures. Both classes implement the `IRes` interface, which defines the methods available on result objects.

Moreover, both classes also implement the `Result` type from the core API, so you can them as arguments to the core and functional API functions as well, though this will result in losing the chaining capabilities of the object-oriented style.

### Overloaded methods

In the core API, some functions are overloaded to give more precise types based on the input (e.g. `mapElse`, `andThen`). In the same vein, the object-oriented API is overloaded by the `Succ` and `Fail` classes to provide the same type precision.

In practice, this means two things:

1. If you have a known `Succ` or `Fail` instance, calling these methods will yield more precise types.
2. The methods are optimized to account for the fact they know if they are called on a success or a failure, avoiding unnecessary checks.

```typescript
const success42 = new Succ(42);
const failureA = new Fail("Error A");

function addOne(x: number) {
  return x + 1;
}

success42.map(addOne); // Known to be Succ<number>
failureA.map(addOne); // Known to be Fail<string>
```

# API Overview

Here's a quick overview of the available methods on `Succ` and `Fail` instances. For more details on the parameters and return types, refer to the [core API documentation](api-core.md).

If a section contains new details specific to the object-oriented style, they will be annotated with this icon: 💡

## Creating Results

Creating results can be done in a few ways:

- Using the factory functions (`succ`, `fail`, `failChecked`, `res`), just like in the core API.
- 💡 Simply `new`ing up an instance of `Succ` or `Fail`.
- 💡 By converting a core result to a class using the `fromResult<S, F>(r: Result<S, F>): IRes<S, F>` function.

## Checking Result Types

You can quickly narrow down the result's type to either `Succ` or `Fail` by using the `.isSucc()` and `.isFail()` methods.

## Accessing Values from Results

Accessing the value inside the result is done differently based on if you know the result's exact type or not.

### Extracting Values from Known Results

💡 Only the `Succ` class has the `.get(): S` method, which extracts the success value.

💡 Only the `Fail` class has the `.getFail(): F` method, which extracts the failure value.

### Extracting Values from Unknown Results

To safely extract values from an undetermined result type (i.e., an `IRes`), you use either:

- `.getChecked()`
- `.getFailChecked()`

### Providing Default Values

To get the value or a default value for both success and failure, use:

- `.getOr()`
- `.getElse()`

## Transforming Result Values

To transform the value of the result, you can use any of the following methods:

- `.map()`
- `.mapFail()`
- `.mapOr()`
- `.mapElse()`

## Composing and Chaining Result Operations

To compose results or chain operations, you can use:

- `.and()`
- `.or()`
- `.andThen()`
- `.orElse()`

## Integrations

Just like in the core API, the object-oriented style provides utility functions for common patterns. The way to use them depends on if you start from a non-Result value or from existing Result instances.

### Non result starting points

- 💡 `fromResult<S, F>(r: Result<S, F>): IRes<S, F>` (already mentioned earlier) transforms a core-style result into an object result.
- `all()` converts an array of `Result`s (core or object, doesn't matter) into a single Result containing an array of success values or the first failure.
- `resulting()` and `resultify()` wrap functions to capture returns into a `Succ` and exceptions into a `Fail`.

### Result starting points

- 💡 The iterator protocol is baked into the class. Just use it directly in a for...of loop.
- `.awaited()` will await a contained `Promise` and return a Promise of an `IRes` with the resolved value or rejection reason.
- `.throwing()` and `.throwingAsync()` will return the success value or throw the failure value as an exception.

### 💡 Iterator Protocol

Since `Succ` and `Fail` are classes, they can naturally implement the iterator protocol without the need for an `iter()` function; though, the behavior is similar to using the core API's iter.

```typescript
const success42 = new Succ(42);
for (const value of success42) {
  console.log("Success value:", value); // Success value: 42
}

const failureA = new Fail("Error A");
for (const _value of failureA) {
  console.log("This will not be logged");
}
```

> I just love this little hack! It makes use of a language feature in a new way and transforms the for...of loop into a quick way to extract success values!
