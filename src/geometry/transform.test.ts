import { describe, expect, it } from "vitest"

import { apply, compose, invert } from "./transform"
import { vec2 } from "./vec2"

describe("apply", () => {
  it("rotates the point before adding the translation", () => {
    const moved = apply({ rotation: Math.PI / 2, translation: vec2(10, 0) }, vec2(1, 0))
    expect(moved.x).toBeCloseTo(10)
    expect(moved.y).toBeCloseTo(1)
  })
})

describe("compose", () => {
  it("applies the inner transform before the outer one", () => {
    const inner = { rotation: 0, translation: vec2(5, 0) }
    const outer = { rotation: Math.PI / 2, translation: vec2(0, 0) }
    const moved = apply(compose(outer, inner), vec2(0, 0))
    expect(moved.x).toBeCloseTo(0)
    expect(moved.y).toBeCloseTo(5)
  })
})

describe("invert", () => {
  it("composes with its source back to the identity mapping", () => {
    const source = { rotation: 0.7, translation: vec2(3, -5) }
    const recovered = apply(compose(invert(source), source), vec2(2, 9))
    expect(recovered.x).toBeCloseTo(2)
    expect(recovered.y).toBeCloseTo(9)
  })
})
