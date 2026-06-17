import { angleDelta } from "../geometry/angle"
import { apply, type Rigid } from "../geometry/transform"
import { distance, type Vec2 } from "../geometry/vec2"

export interface GridCell {
  readonly row: number
  readonly column: number
}

export function areAdjacent(a: GridCell, b: GridCell): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.column - b.column) === 1
}

export function posesAlign(
  a: Rigid,
  b: Rigid,
  canonicalPoint: Vec2,
  positionTolerance: number,
  angleTolerance: number,
): boolean {
  if (Math.abs(angleDelta(a.rotation, b.rotation)) > angleTolerance) {
    return false
  }
  return distance(apply(a, canonicalPoint), apply(b, canonicalPoint)) <= positionTolerance
}
