import { describe, expect, it } from "vitest"

import { vec2 } from "../geometry/vec2"
import { makePrng } from "../random/prng"
import { knobEdge, reverseEdge, straightEdge } from "./edge"
import type { Edge } from "./types"

function points(edge: Edge): readonly number[][] {
  const flat = [edge.start]
  for (const segment of edge.segments) {
    flat.push(segment.control1, segment.control2, segment.end)
  }
  return flat.map((point) => [point.x, point.y])
}

describe("knobEdge", () => {
  it("anchors its endpoints exactly on the corners it spans", () => {
    const start = vec2(10, 20)
    const end = vec2(110, 20)
    const edge = knobEdge(start, end, makePrng(7))
    expect(edge.start).toEqual(start)
    expect(edge.segments.at(-1)?.end).toEqual(end)
  })
})

describe("reverseEdge", () => {
  it("walks the same point path backwards", () => {
    const edge = knobEdge(vec2(0, 0), vec2(100, 0), makePrng(3))
    expect(points(reverseEdge(edge))).toEqual([...points(edge)].reverse())
  })

  it("restores the original edge when applied twice", () => {
    const edge = knobEdge(vec2(0, 0), vec2(100, 0), makePrng(5))
    expect(reverseEdge(reverseEdge(edge))).toEqual(edge)
  })
})

describe("straightEdge", () => {
  it("keeps both control points on the segment line", () => {
    const edge = straightEdge(vec2(0, 0), vec2(30, 60))
    const segment = edge.segments[0]
    expect(segment?.control1).toEqual(vec2(10, 20))
    expect(segment?.control2).toEqual(vec2(20, 40))
  })
})
