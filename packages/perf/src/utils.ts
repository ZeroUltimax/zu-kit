interface Named {
  name: string;
}

export function byIdOrName<T extends Named>(map: Map<string, T>, idOrName: string): T | undefined {
  const byId = map.get(idOrName);
  if (byId !== undefined) return byId;
  return map.values().find((x) => x.name === idOrName);
}

export function nth<T>(it: Iterable<T>, n: number): T | undefined {
  let i = 0;
  for (const item of it) if (i++ === n) return item;
  return undefined;
}
