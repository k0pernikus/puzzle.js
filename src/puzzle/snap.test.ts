import { describe, expect, it } from "vitest"

import type { Rigid } from "../geometry/transform"
import { vec2 } from "../geometry/vec2"
import { areAdjacent, posesAlign } from "./snap"

describe("areAdjacent", () => {
  it("treats orthogonal grid neighbours as adjacent", () => {
    expect(areAdjacent({ row: 2, column: 3 }, { row: 2, column: 4 })).toBe(true)
    expect(areAdjacent({ row: 2, column: 3 }, { row: 3, column: 3 })).toBe(true)
  })

  it("rejects diagonal, identical, and distant cells", () => {
    expect(areAdjacent({ row: 2, column: 3 }, { row: 3, column: 4 })).toBe(false)
    expect(areAdjacent({ row: 2, column: 3 }, { row: 2, column: 3 })).toBe(false)
    expect(areAdjacent({ row: 0, column: 0 }, { row: 0, column: 2 })).toBe(false)
  })
})

describe("posesAlign", () => {
  const anchor: Rigid = { rotation: 0, translation: vec2(100, 100) }

  it("aligns identical poses", () => {
    expect(posesAlign(anchor, anchor, vec2(0, 0), 5, 0.1)).toBe(true)
  })

  it("accepts small offsets within tolerance so no perfect fit is needed", () => {
    const nudged: Rigid = { rotation: 0.05, translation: vec2(103, 100) }
    expect(posesAlign(anchor, nudged, vec2(0, 0), 5, 0.1)).toBe(true)
  })

  it("rejects a position gap beyond tolerance", () => {
    const shifted: Rigid = { rotation: 0, translation: vec2(120, 100) }
    expect(posesAlign(anchor, shifted, vec2(0, 0), 5, 0.1)).toBe(false)
  })

  it("rejects a rotation gap beyond tolerance", () => {
    const turned: Rigid = { rotation: 0.5, translation: vec2(100, 100) }
    expect(posesAlign(anchor, turned, vec2(0, 0), 5, 0.1)).toBe(false)
  })
})
