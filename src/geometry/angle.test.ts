import { describe, expect, it } from "vitest"

import { angleDelta, normalizeAngle, TAU } from "./angle"

describe("normalizeAngle", () => {
  it("folds an angle just past +pi to just past -pi", () => {
    expect(normalizeAngle(Math.PI + 0.5)).toBeCloseTo(-Math.PI + 0.5)
  })

  it("keeps +pi at +pi instead of flipping to -pi", () => {
    expect(normalizeAngle(Math.PI)).toBeCloseTo(Math.PI)
  })

  it("collapses a full turn to zero", () => {
    expect(normalizeAngle(TAU)).toBeCloseTo(0)
  })
})

describe("angleDelta", () => {
  it("takes the short arc across the +pi/-pi seam", () => {
    expect(angleDelta(Math.PI - 0.1, -Math.PI + 0.1)).toBeCloseTo(0.2)
  })
})
