import type { Vec2 } from "../geometry/vec2"
import { sub } from "../geometry/vec2"
import type { Piece } from "../puzzle/piece"

const WHEEL_STEP = Math.PI / 24
const KEY_STEP = Math.PI / 2

export interface InteractionPorts {
  readonly canvas: HTMLCanvasElement
  readonly pieces: Piece[]
  readonly toBoard: (clientX: number, clientY: number) => Vec2
  readonly pick: (board: Vec2) => Piece | undefined
  readonly requestRender: () => void
}

export function setupInteraction(ports: InteractionPorts): void {
  let dragging: Piece | undefined
  let grabOffset: Vec2 = { x: 0, y: 0 }
  let pointer: Vec2 = { x: 0, y: 0 }

  const raise = (piece: Piece): void => {
    const index = ports.pieces.indexOf(piece)
    if (index < 0) {
      return
    }
    ports.pieces.splice(index, 1)
    ports.pieces.push(piece)
  }

  const rotateActive = (delta: number): void => {
    const target = dragging ?? ports.pick(pointer)
    if (!target) {
      return
    }
    target.rotation += delta
    ports.requestRender()
  }

  ports.canvas.addEventListener("pointerdown", (event) => {
    pointer = ports.toBoard(event.clientX, event.clientY)
    const hit = ports.pick(pointer)
    if (!hit) {
      return
    }
    dragging = hit
    grabOffset = sub(pointer, hit.translation)
    raise(hit)
    ports.canvas.setPointerCapture(event.pointerId)
    ports.requestRender()
  })

  ports.canvas.addEventListener("pointermove", (event) => {
    pointer = ports.toBoard(event.clientX, event.clientY)
    if (!dragging) {
      return
    }
    dragging.translation = sub(pointer, grabOffset)
    ports.requestRender()
  })

  const endDrag = (event: PointerEvent): void => {
    if (!dragging) {
      return
    }
    dragging = undefined
    ports.canvas.releasePointerCapture(event.pointerId)
  }
  ports.canvas.addEventListener("pointerup", endDrag)
  ports.canvas.addEventListener("pointercancel", endDrag)

  ports.canvas.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault()
      pointer = ports.toBoard(event.clientX, event.clientY)
      rotateActive(Math.sign(event.deltaY) * WHEEL_STEP)
    },
    { passive: false },
  )

  window.addEventListener("keydown", (event) => {
    if (event.key === "[") {
      rotateActive(-KEY_STEP)
    }
    if (event.key === "]") {
      rotateActive(KEY_STEP)
    }
  })
}
