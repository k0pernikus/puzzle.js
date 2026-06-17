import { describe, expect, it } from "vitest"

import { vec2 } from "../geometry/vec2"
import { boardToOutline, outlineToBoard, type Pose } from "./piece"

describe("outlineToBoard / boardToOutline", () => {
  it("round-trips an outline point through the board and back", () => {
    const pose: Pose = { pivot: vec2(50, 50), rotation: 0.6, translation: vec2(200, 120) }
    const back = boardToOutline(pose, outlineToBoard(pose, vec2(70, 30)))
    expect(back.x).toBeCloseTo(70)
    expect(back.y).toBeCloseTo(30)
  })

  it("pins the pivot onto the translation whatever the rotation", () => {
    const pose: Pose = { pivot: vec2(50, 50), rotation: 1.2, translation: vec2(200, 120) }
    const board = outlineToBoard(pose, vec2(50, 50))
    expect(board.x).toBeCloseTo(200)
    expect(board.y).toBeCloseTo(120)
  })
})
