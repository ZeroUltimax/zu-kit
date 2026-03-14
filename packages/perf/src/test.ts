export interface Experiment<V> {
  id: string;
  name: string;
  tests: Map<string, Test<V>>;
  variants: Map<string, Variant<V>>;
}

export interface Test<V> {
  id: string;
  name: string;
  factory: TestFactory<V>;
}
export type TestFactory<V> = (variant: V) => Generator<TestInstance>;
export type TestInstance = (acc: number) => number;
export function instantiateTests<V>(factory: TestFactory<V>, variant: V, count: number): TestInstance[] {
  const instance = [];
  for (const test of factory(variant)) {
    instance.push(test);
    if (instance.length >= count) break;
  }
  return instance;
}

export interface Variant<V> {
  id: string;
  name: string;
  value: V;
}
