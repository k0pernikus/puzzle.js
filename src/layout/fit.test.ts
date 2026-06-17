import { describe, expect, it } from "vitest"

import { containFit } from "./fit"

describe("containFit", () => {
  it("constrains a wide image by viewport width and letterboxes vertically", () => {
    const placement = containFit({ width: 200, height: 100 }, { width: 100, height: 100 })
    expect(placement.width).toBeCloseTo(100)
    expect(placement.height).toBeCloseTo(50)
    expect(placement.offsetX).toBeCloseTo(0)
    expect(placement.offsetY).toBeCloseTo(25)
  })

  it("constrains a tall image by viewport height and pillarboxes horizontally", () => {
    const placement = containFit({ width: 100, height: 200 }, { width: 100, height: 100 })
    expect(placement.width).toBeCloseTo(50)
    expect(placement.height).toBeCloseTo(100)
    expect(placement.offsetX).toBeCloseTo(25)
    expect(placement.offsetY).toBeCloseTo(0)
  })
})
