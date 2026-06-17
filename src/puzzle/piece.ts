import type { Vec2 } from "../geometry/vec2"
import { vec2 } from "../geometry/vec2"
import { generatePuzzleShapes, type PuzzleSpec } from "../shape/puzzle"
import type { PieceShape } from "../shape/types"

export interface Piece {
  readonly id: number
  readonly row: number
  readonly column: number
  readonly outline: PieceShape
  readonly pivot: Vec2
}

export function buildPieces(spec: PuzzleSpec): Piece[] {
  return generatePuzzleShapes(spec).map((shape, id) => ({
    id,
    row: shape.row,
    column: shape.column,
    outline: shape,
    pivot: vec2((shape.column + 0.5) * spec.tileWidth, (shape.row + 0.5) * spec.tileHeight),
  }))
}
