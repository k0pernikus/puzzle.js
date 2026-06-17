import { apply, invert } from "../geometry/transform"
import type { Vec2 } from "../geometry/vec2"
import type { Board, Cluster } from "../puzzle/board"
import type { Piece } from "../puzzle/piece"
import { buildPiecePath } from "./piece-path"

const SEAM_STYLE = "rgba(0, 0, 0, 0.4)"

export function buildPathCache(pieces: readonly Piece[]): Map<number, Path2D> {
  return new Map(pieces.map((piece) => [piece.id, buildPiecePath(piece.outline)]))
}

export function renderBoard(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  board: Board,
  paths: ReadonlyMap<number, Path2D>,
  puzzleWidth: number,
  puzzleHeight: number,
): void {
  for (const cluster of board.clusters) {
    context.save()
    context.translate(cluster.pose.translation.x, cluster.pose.translation.y)
    context.rotate(cluster.pose.rotation)

    for (const id of cluster.members) {
      const path = paths.get(id)
      if (!path) {
        continue
      }
      context.save()
      context.clip(path)
      context.drawImage(image, 0, 0, puzzleWidth, puzzleHeight)
      context.restore()
    }

    context.strokeStyle = SEAM_STYLE
    context.lineWidth = 1
    for (const id of cluster.members) {
      const path = paths.get(id)
      if (!path) {
        continue
      }
      context.stroke(path)
    }
    context.restore()
  }
}

function topCluster(
  context: CanvasRenderingContext2D,
  board: Board,
  paths: ReadonlyMap<number, Path2D>,
  boardPoint: Vec2,
): Cluster | undefined {
  for (let index = board.clusters.length - 1; index >= 0; index--) {
    const cluster = board.clusters[index]
    if (!cluster) {
      continue
    }
    const local = apply(invert(cluster.pose), boardPoint)
    for (const id of cluster.members) {
      const path = paths.get(id)
      if (!path) {
        continue
      }
      if (context.isPointInPath(path, local.x, local.y)) {
        return cluster
      }
    }
  }
  return undefined
}

export function pickCluster(
  context: CanvasRenderingContext2D,
  board: Board,
  paths: ReadonlyMap<number, Path2D>,
  boardPoint: Vec2,
): Cluster | undefined {
  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  const hit = topCluster(context, board, paths, boardPoint)
  context.restore()
  return hit
}
