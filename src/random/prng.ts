export interface Prng {
  next(): number
  uniform(min: number, max: number): number
  bool(): boolean
}

export function makePrng(seed: number): Prng {
  let state = seed >>> 0

  function next(): number {
    state = (state + 0x6d2b79f5) >>> 0
    let mixed = state
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1)
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61)
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296
  }

  function uniform(min: number, max: number): number {
    return min + next() * (max - min)
  }

  function bool(): boolean {
    return next() < 0.5
  }

  return { next, uniform, bool }
}
