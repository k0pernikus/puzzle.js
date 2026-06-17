import type { Vec2 } from "../geometry/vec2"

export interface CubicSegment {
  readonly control1: Vec2
  readonly control2: Vec2
  readonly end: Vec2
}

export interface Edge {
  readonly start: Vec2
  readonly segments: readonly CubicSegment[]
}

export type EdgeSide = "top" | "right" | "bottom" | "left"

export interface PieceShape {
  readonly row: number
  readonly column: number
  readonly edges: Readonly<Record<EdgeSide, Edge>>
}
