import type { Vec2 } from "../geometry/vec2"
import { boardToOutline, type Piece } from "../puzzle/piece"
import { buildPiecePath } from "./piece-path"

const SEAM_STYLE = "rgba(0, 0, 0, 0.35)"

export function buildPathCache(pieces: readonly Piece[]): Map<number, Path2D> {
  return new Map(pieces.map((piece) => [piece.id, buildPiecePath(piece.outline)]))
}

export function renderScene(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  pieces: readonly Piece[],
  paths: ReadonlyMap<number, Path2D>,
  offset: Vec2,
  puzzleWidth: number,
  puzzleHeight: number,
): void {
  for (const piece of pieces) {
    const path = paths.get(piece.id)
    if (!path) {
      continue
    }
    context.save()
    context.translate(offset.x + piece.translation.x, offset.y + piece.translation.y)
    context.rotate(piece.rotation)
    context.translate(-piece.pivot.x, -piece.pivot.y)

    context.save()
    context.clip(path)
    context.drawImage(image, 0, 0, puzzleWidth, puzzleHeight)
    context.restore()

    context.strokeStyle = SEAM_STYLE
    context.lineWidth = 1
    context.stroke(path)
    context.restore()
  }
}

function topHit(
  context: CanvasRenderingContext2D,
  pieces: readonly Piece[],
  paths: ReadonlyMap<number, Path2D>,
  boardPoint: Vec2,
): Piece | undefined {
  for (let index = pieces.length - 1; index >= 0; index--) {
    const piece = pieces[index]
    if (!piece) {
      continue
    }
    const path = paths.get(piece.id)
    if (!path) {
      continue
    }
    const local = boardToOutline(piece, boardPoint)
    if (context.isPointInPath(path, local.x, local.y)) {
      return piece
    }
  }
  return undefined
}

export function hitTest(
  context: CanvasRenderingContext2D,
  pieces: readonly Piece[],
  paths: ReadonlyMap<number, Path2D>,
  boardPoint: Vec2,
): Piece | undefined {
  context.save()
  context.setTransform(1, 0, 0, 1, 0, 0)
  const hit = topHit(context, pieces, paths, boardPoint)
  context.restore()
  return hit
}
