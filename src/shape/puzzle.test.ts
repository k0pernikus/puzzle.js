import { describe, expect, it } from "vitest"

import { at } from "../util/array"
import { generatePuzzleShapes } from "./puzzle"
import type { Edge, EdgeSide, PieceShape } from "./types"

const SPEC = {
  rows: 3,
  columns: 4,
  tileWidth: 100,
  tileHeight: 80,
  seed: 42,
}

function pieceAt(pieces: readonly PieceShape[], row: number, column: number): PieceShape {
  const found = pieces.find((piece) => piece.row === row && piece.column === column)
  if (!found) {
    throw new Error(`no piece at ${row},${column}`)
  }
  return found
}

function points(edge: Edge): readonly number[][] {
  const flat = [edge.start]
  for (const segment of edge.segments) {
    flat.push(segment.control1, segment.control2, segment.end)
  }
  return flat.map((point) => [point.x, point.y])
}

function isStraight(edge: Edge): boolean {
  return edge.segments.length === 1
}

describe("generatePuzzleShapes", () => {
  it("creates one piece per grid cell", () => {
    expect(generatePuzzleShapes(SPEC)).toHaveLength(SPEC.rows * SPEC.columns)
  })

  it("flattens the four outer borders of the puzzle", () => {
    const pieces = generatePuzzleShapes(SPEC)
    expect(isStraight(pieceAt(pieces, 0, 1).edges.top)).toBe(true)
    expect(isStraight(pieceAt(pieces, 2, 1).edges.bottom)).toBe(true)
    expect(isStraight(pieceAt(pieces, 1, 0).edges.left)).toBe(true)
    expect(isStraight(pieceAt(pieces, 1, 3).edges.right)).toBe(true)
  })

  it("knobs every interior edge", () => {
    const pieces = generatePuzzleShapes(SPEC)
    expect(isStraight(pieceAt(pieces, 0, 1).edges.bottom)).toBe(false)
    expect(isStraight(pieceAt(pieces, 1, 1).edges.left)).toBe(false)
  })

  it("shares each interior seam between the two pieces that meet on it", () => {
    const pieces = generatePuzzleShapes(SPEC)
    const upper = pieceAt(pieces, 1, 2)
    const lower = pieceAt(pieces, 2, 2)
    expect(points(upper.edges.bottom)).toEqual([...points(lower.edges.top)].reverse())

    const leftPiece = pieceAt(pieces, 1, 1)
    const rightPiece = pieceAt(pieces, 1, 2)
    expect(points(leftPiece.edges.right)).toEqual([...points(rightPiece.edges.left)].reverse())
  })

  it("closes each piece outline into a loop", () => {
    const piece = pieceAt(generatePuzzleShapes(SPEC), 1, 1)
    const order: EdgeSide[] = ["top", "right", "bottom", "left"]
    order.forEach((side, index) => {
      const current = piece.edges[side]
      const next = piece.edges[at(order, (index + 1) % order.length)]
      expect(current.segments.at(-1)?.end).toEqual(next.start)
    })
  })
})
