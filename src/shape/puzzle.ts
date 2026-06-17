import type { Vec2 } from "../geometry/vec2"
import { vec2 } from "../geometry/vec2"
import { makePrng } from "../random/prng"
import { at } from "../util/array"
import { knobEdge, reverseEdge, straightEdge } from "./edge"
import type { Edge, PieceShape } from "./types"

export interface PuzzleSpec {
  readonly rows: number
  readonly columns: number
  readonly tileWidth: number
  readonly tileHeight: number
  readonly seed: number
}

export function generatePuzzleShapes(spec: PuzzleSpec): PieceShape[] {
  const prng = makePrng(spec.seed)
  const corner = (column: number, row: number): Vec2 =>
    vec2(column * spec.tileWidth, row * spec.tileHeight)

  const horizontal: Edge[][] = []
  for (let row = 0; row <= spec.rows; row++) {
    const edges: Edge[] = []
    for (let column = 0; column < spec.columns; column++) {
      const start = corner(column, row)
      const end = corner(column + 1, row)
      const isBorder = row === 0 || row === spec.rows
      edges.push(isBorder ? straightEdge(start, end) : knobEdge(start, end, prng))
    }
    horizontal.push(edges)
  }

  const vertical: Edge[][] = []
  for (let row = 0; row < spec.rows; row++) {
    const edges: Edge[] = []
    for (let column = 0; column <= spec.columns; column++) {
      const start = corner(column, row)
      const end = corner(column, row + 1)
      const isBorder = column === 0 || column === spec.columns
      edges.push(isBorder ? straightEdge(start, end) : knobEdge(start, end, prng))
    }
    vertical.push(edges)
  }

  const pieces: PieceShape[] = []
  for (let row = 0; row < spec.rows; row++) {
    for (let column = 0; column < spec.columns; column++) {
      pieces.push({
        row,
        column,
        edges: {
          top: at(at(horizontal, row), column),
          right: at(at(vertical, row), column + 1),
          bottom: reverseEdge(at(at(horizontal, row + 1), column)),
          left: reverseEdge(at(at(vertical, row), column)),
        },
      })
    }
  }
  return pieces
}
