import "./style.css"

function requireElement<E extends Element>(selector: string): E {
  const element = document.querySelector<E>(selector)
  if (!element) {
    throw new Error(`missing required element: ${selector}`)
  }
  return element
}

function require2dContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const context = canvas.getContext("2d")
  if (!context) {
    throw new Error("2d canvas context unavailable")
  }
  return context
}

function fitToViewport(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
  const ratio = window.devicePixelRatio
  canvas.width = Math.round(window.innerWidth * ratio)
  canvas.height = Math.round(window.innerHeight * ratio)
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function paintPlaceholder(context: CanvasRenderingContext2D): void {
  const width = window.innerWidth
  const height = window.innerHeight
  context.clearRect(0, 0, width, height)
  context.fillStyle = "#e6e6e6"
  context.font = "600 48px system-ui, sans-serif"
  context.textAlign = "center"
  context.textBaseline = "middle"
  context.fillText("puzzle.js", width / 2, height / 2)
}

const root = requireElement<HTMLDivElement>("#app")
const canvas = document.createElement("canvas")
root.append(canvas)
const context = require2dContext(canvas)

function repaint(): void {
  fitToViewport(canvas, context)
  paintPlaceholder(context)
}

repaint()
window.addEventListener("resize", repaint)
