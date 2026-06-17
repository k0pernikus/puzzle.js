import type { Vec2 } from "../geometry/vec2"
import { sub } from "../geometry/vec2"
import type { Cluster } from "../puzzle/board"

const WHEEL_STEP = Math.PI / 24
const KEY_STEP = Math.PI / 2

export interface InteractionPorts {
  readonly canvas: HTMLCanvasElement
  readonly toBoard: (clientX: number, clientY: number) => Vec2
  readonly pick: (board: Vec2) => Cluster | undefined
  readonly raise: (cluster: Cluster) => void
  readonly translate: (cluster: Cluster, delta: Vec2) => void
  readonly rotate: (cluster: Cluster, center: Vec2, angle: number) => void
  readonly settle: (cluster: Cluster) => void
  readonly requestRender: () => void
}

export function setupInteraction(ports: InteractionPorts): void {
  let dragging: Cluster | undefined
  let last: Vec2 = { x: 0, y: 0 }
  let pointer: Vec2 = { x: 0, y: 0 }

  const rotateActive = (delta: number): void => {
    const target = dragging ?? ports.pick(pointer)
    if (!target) {
      return
    }
    ports.rotate(target, pointer, delta)
    if (!dragging) {
      ports.settle(target)
    }
    ports.requestRender()
  }

  ports.canvas.addEventListener("pointerdown", (event) => {
    pointer = ports.toBoard(event.clientX, event.clientY)
    const hit = ports.pick(pointer)
    if (!hit) {
      return
    }
    dragging = hit
    last = pointer
    ports.raise(hit)
    ports.canvas.setPointerCapture(event.pointerId)
    ports.requestRender()
  })

  ports.canvas.addEventListener("pointermove", (event) => {
    pointer = ports.toBoard(event.clientX, event.clientY)
    if (!dragging) {
      return
    }
    ports.translate(dragging, sub(pointer, last))
    last = pointer
    ports.requestRender()
  })

  const endDrag = (event: PointerEvent): void => {
    if (!dragging) {
      return
    }
    const dropped = dragging
    dragging = undefined
    ports.canvas.releasePointerCapture(event.pointerId)
    ports.settle(dropped)
    ports.requestRender()
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
