import type { Vec2 } from "../geometry/vec2"
import { add, rotate, sub, vec2 } from "../geometry/vec2"
import { generatePuzzleShapes, type PuzzleSpec } from "../shape/puzzle"
import type { PieceShape } from "../shape/types"

export interface Pose {
  readonly pivot: Vec2
  readonly rotation: number
  readonly translation: Vec2
}

export interface Piece {
  readonly id: number
  readonly outline: PieceShape
  readonly pivot: Vec2
  rotation: number
  translation: Vec2
}

export function outlineToBoard(pose: Pose, point: Vec2): Vec2 {
  return add(pose.translation, rotate(sub(point, pose.pivot), pose.rotation))
}

export function boardToOutline(pose: Pose, point: Vec2): Vec2 {
  return add(pose.pivot, rotate(sub(point, pose.translation), -pose.rotation))
}

export function buildPieces(spec: PuzzleSpec): Piece[] {
  return generatePuzzleShapes(spec).map((shape, id) => {
    const pivot = vec2((shape.column + 0.5) * spec.tileWidth, (shape.row + 0.5) * spec.tileHeight)
    return {
      id,
      outline: shape,
      pivot,
      rotation: 0,
      translation: pivot,
    }
  })
}
