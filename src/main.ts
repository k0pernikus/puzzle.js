import "./style.css"

import exampleUrl from "../img/example.jpg"
import { containFit } from "./layout/fit"
import { renderSolved } from "./render/solved-scene"
import { generatePuzzleShapes } from "./shape/puzzle"

const ROWS = 6
const COLUMNS = 6
const SEED = 42

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

function fitCanvas(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D): void {
  const ratio = window.devicePixelRatio
  canvas.width = Math.round(window.innerWidth * ratio)
  canvas.height = Math.round(window.innerHeight * ratio)
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
}

const root = requireElement<HTMLDivElement>("#app")
const canvas = document.createElement("canvas")
root.append(canvas)
const context = require2dContext(canvas)
const image = new Image()

function render(): void {
  fitCanvas(canvas, context)
  context.clearRect(0, 0, window.innerWidth, window.innerHeight)
  if (image.naturalWidth === 0) {
    return
  }
  const placement = containFit(
    { width: image.naturalWidth, height: image.naturalHeight },
    { width: window.innerWidth, height: window.innerHeight },
  )
  const pieces = generatePuzzleShapes({
    rows: ROWS,
    columns: COLUMNS,
    tileWidth: placement.width / COLUMNS,
    tileHeight: placement.height / ROWS,
    seed: SEED,
  })
  renderSolved(context, image, pieces, placement)
}

image.addEventListener("load", render)
image.src = exampleUrl
window.addEventListener("resize", render)
