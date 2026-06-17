import { describe, expect, it } from "vitest"

import { makePrng } from "./prng"

function take(seed: number, count: number): number[] {
  const prng = makePrng(seed)
  return Array.from({ length: count }, () => prng.next())
}

describe("makePrng", () => {
  it("produces the same stream for the same seed", () => {
    expect(take(123, 5)).toEqual(take(123, 5))
  })

  it("produces a different stream for a different seed", () => {
    expect(take(1, 5)).not.toEqual(take(2, 5))
  })

  it("stays within the unit interval", () => {
    const values = take(999, 1000)
    expect(Math.min(...values)).toBeGreaterThanOrEqual(0)
    expect(Math.max(...values)).toBeLessThan(1)
  })
})
