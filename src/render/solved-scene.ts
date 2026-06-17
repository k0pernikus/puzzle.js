import type { Placement } from "../layout/fit"
import type { PieceShape } from "../shape/types"
import { buildPiecePath } from "./piece-path"

const SEAM_STYLE = "rgba(0, 0, 0, 0.35)"

export function renderSolved(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  pieces: readonly PieceShape[],
  placement: Placement,
): void {
  const paths = pieces.map((piece) => buildPiecePath(piece))
  context.save()
  context.translate(placement.offsetX, placement.offsetY)

  for (const path of paths) {
    context.save()
    context.clip(path)
    context.drawImage(image, 0, 0, placement.width, placement.height)
    context.restore()
  }

  context.strokeStyle = SEAM_STYLE
  context.lineWidth = 1
  for (const path of paths) {
    context.stroke(path)
  }

  context.restore()
}
