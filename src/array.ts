export function compact(array: Array<string | null>) {
  return array.filter(self) as string[];
}

export function unique(array: string[]) {
  return Array.from(new Set(array));
}

export function self(value: any) {
  return value;
}
