# Result API - Functional Style

Some parts of the core API can be clunky to use in their raw form, especially multi-argument functions like `andThen`, `orElse`, and `map`. To make your life easier, we provide functional-style versions of these functions! They work just like the core functions, but they're _curried_, allowing you to more easily create chains of operations.

> I'm a sucker for functional programming. My go-to way of using functional APIs is currently through a `pipe` function, though I'm keeping an eye out for the `|>` operator once it lands in JavaScript.

If you want to use functional-style APIs, import your `zu-res` functions from the `zu-res/fn` module.

```typescript
import { andThen, fail, map, orElse, succ } from "zu-res/fn";

const success42 = succ(42);
const failureA = fail("Error A");

const doubleIt = map((x: number) => x * 2);
const orElseOne = orElse(() => succ(1));
const andThenTriple = andThen((x: number) => succ(x * 3));

andThenTriple(orElseOne(doubleIt(success42))); // Success(252)

andThenTriple(orElseOne(doubleIt(failureA))); // Success(3)
```

We won't repeat the entire API here, only the functions that have a different signature in their functional form. For the core API reference, see [the core API docs](api-core.md).

## Default Value Getters

The value getter functions in curried form lets you specify the default value or default value function first.

- `getOr(def: DS): (r: Result<S, F>) => S | DS` takes the default value, and returns a getter function. The getter function will return either the success value or the default.
- `getElse(defFn: (f: F) => DS): (r: Result<S, F>) => S | DS` takes the default value function, and returns a getter function. The getter function will return either the success value or the result of calling the default value function with the failure value.

```typescript
const success42 = succ(42);
const failureA = fail("Error A");

const getOrZero = getOr(0);
const getElseCaps = getElse((s: string) => s.toUpperCase());

getOrZero(success42); // 42
getOrZero(failureA); // 0

getElseCaps(success42); // 42
getElseCaps(failureA); // "ERROR A"
```

## Mapping Functions

All mapping functions are curried, allowing you to create specialized mappers easily.

- `map(proj: (s: S) => T): (r: Result<S, F>) => Result<T, F>` takes a projection function, and returns a mapper function. The mapper function will apply the projection to the success value if the result is a success.
- `mapFail(projFail: (f: NonNullable<F>) => NonNullable<G>): (r: Result<S, F>) => Result<S, G>` takes a failure projection function, and returns a failure mapper function. The failure mapper function will apply the projection to the failure value if the result is a failure.

```typescript
const success42 = succ(42);
const failureA = fail("Error A");

const doubleIt = map((x: number) => x * 2);
const uppercaseFail = mapFail((s: string) => s.toUpperCase());

doubleIt(success42); // Success(84)
doubleIt(failureA); // Failure("Error A")

uppercaseFail(success42); // Success(42)
uppercaseFail(failureA); // Failure("ERROR A")
```

Similarly, the extraction mappers can also be used in functional form.

- `mapOr(proj: (s: S) => T, def: U): (r: Result<S, F>) => T | U` takes a projection function and a default value, and returns an extractor function. The extractor function will return either the transformed success value or the default.
- `mapElse(proj: (s: S) => T, projFail: (f: F) => G): (r: Result<S, F>) => T | G` takes a projection function and a failure projection function, and returns an extractor function. The extractor function will return either the transformed success value or the result of calling the failure projection with the failure value.

```typescript
const success42 = succ(42);
const failureA = fail("Error A");

const tripleOrZero = mapOr((x: number) => x * 3, 0);
const getSqrtOrCaps = mapElse(
  (x: number) => Math.sqrt(x),
  (s: string) => s.toUpperCase()
);

tripleOrZero(success42); // 126
tripleOrZero(failureA); // 0

getSqrtOrStringLength(success42); // 6.48074069840786
getSqrtOrStringLength(failureA); // "ERROR A"
```

> My examples here aren't the best, mainly because I struggle to come up with good examples on the spot. Feel free to suggest improvements or better examples!

## Composing and Chaining

The composing and chaining functions are also curried, allowing you to create specialized chaining functions easily.

Though a bit strange to use, the composing functions take the second result first, and return a function that takes the first result.

- `and(b: Result<T, F>): (a: Result<S, F>) => Result<T, F>` takes the second result, and returns a function that takes the first result. The returned function will return the second result if both are successes, or the first failure encountered.
- `or(b: Result<S, G>): (a: Result<S, F>) => Result<S, G>` takes the second result, and returns a function that takes the first result. The returned function will return the first success encountered, or the last failure if both are failures.

> I've never had to use these composing functions in this form, but they're here if you need them!

```typescript
const success42 = succ(42);
const success99 = succ(99);
const failureA = fail("Error A");
const failureB = fail("Error B");

const and99 = and(success99);
and99(success42); // succ(99)
and99(failureA); // fail("Error A")

const andB = and(failureB);
andB(success42); // fail("Error B")
andB(failureA); // fail("Error A")

const or99 = or(success99);
or99(success42); // succ(42)
or99(failureA); // succ(99)

const orB = or(failureB);
orB(success42); // succ(42)
orB(failureA); // fail("Error B")
```

The real powerhouse of the functional API are the chaining functions, they let you build up a complete chain of operations. They take the chained function first, and return a function that takes the result to operate on.

- `andThen(fn: (s: S) => Result<T, F>): (r: Result<S, F>) => Result<T, F>` takes a function that produces a result from a success value, and returns a function that takes a result. The returned function will invoke the chained function if the result is a success.
- `orElse(fn: (f: F) => Result<S, G>): (r: Result<S, F>) => Result<S, G>` takes a function that produces a result from a failure value, and returns a function that takes a result. The returned function will invoke the chained function if the result is a failure.

```typescript
const success42 = succ(42);
const failureA = fail("Error A");

const andThenDouble = andThen((x: number) => succ(x * 2));

andThenDouble(success42); // Success(84)
andThenDouble(failureA); // Failure("Error A")

const orElseCCaps = orElse((err: string) => fail(err.toUpperCase()));

orElseCCaps(success42); // Success(42)
orElseCCaps(failureA); // Failure("ERROR A")
```
