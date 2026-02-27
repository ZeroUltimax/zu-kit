# Goal

Find which internal works generally the best in performance benchmarks.

# Possible factors

- Hidden class optimizations by V8
- Boolean casting
- Checking of inexistent properties
- Having to check for both null and undefined vs just null OR undefined
- Checking for property existence via `in` vs direct access

# Possible confounding variables

- New object creation cost
- Actual value types used (primitives vs objects)
  - Does one type benefit more from hidden class optimizations?

# Variations to test

- Internal format has both succ and fail, or just one of them.
- Result type is implicit (from field value OR presence) vs explicit (from a boolean marker)
- Using just `null`, just `undefined`, or both `null | undefined` to represent failures in implicit cases
- Checking property existance via `in` vs direct access.

## Formats

1. **monoFlagged**: `{ isFail: boolean, value: S | F }`
2. **dualFlagged**: `{ isFail: false, succ: S } | { isFail: true, fail: F }`
3. **mirrorFlagged**: `{ isFail: false, succ: S, fail: null } | { isFail: true, succ: null, fail: F }`
4. **dual**: `{ succ: S } | { fail: F }`
   1. **dualCheckIn**: Check with `in`
   2. **dualCheckNullish**: Check with !=null
   3. **dualCheckUndefined**: Check with !==undefined
5. **mirrorNull**: `{ succ: S, fail: null } | { succ: null, fail: F }`
   1. **mirrorNullCheckNullish**: Check with !=null
   2. **mirrorNullCheckNull**: Check with !==null
6. **mirrorUndefined**: `{ succ: S, fail: undefined } | { succ: undefined, fail: F }`
   1. **mirrorUndefinedCheckNullish**: Check with !=null
   2. **mirrorUndefinedCheckUndefined**: Check with !==undefined

## Values

- Primitives (number)
- Simple Objects ( single property object )
- Class Objects ( Map )

# Test ideas

1. Simple check cost (type guard + access)
2. Allocation cost
   - Will include the check + access cost as well
3. Map usage cost
   - Will include the check, access and alloc costs due to how map works
4. Chained operations cost, map + andThen + orElse
   - Might reveal differences in how well each format composes
