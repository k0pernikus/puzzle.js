export function at<T>(items: readonly T[], index: number): T {
  const item = items[index]
  if (item === undefined) {
    throw new Error(`array index ${index} out of range (length ${items.length})`)
  }
  return item
}
