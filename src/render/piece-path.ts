import type { Edge, PieceShape } from "../shape/types"

function traceEdge(path: Path2D, edge: Edge): void {
  for (const segment of edge.segments) {
    path.bezierCurveTo(
      segment.control1.x,
      segment.control1.y,
      segment.control2.x,
      segment.control2.y,
      segment.end.x,
      segment.end.y,
    )
  }
}

export function buildPiecePath(piece: PieceShape): Path2D {
  const path = new Path2D()
  path.moveTo(piece.edges.top.start.x, piece.edges.top.start.y)
  traceEdge(path, piece.edges.top)
  traceEdge(path, piece.edges.right)
  traceEdge(path, piece.edges.bottom)
  traceEdge(path, piece.edges.left)
  path.closePath()
  return path
}
