import "./style.css"

import exampleUrl from "../img/example.jpg"
import { sub, vec2, type Vec2 } from "./geometry/vec2"
import { setupInteraction } from "./input/interaction"
import { containFit } from "./layout/fit"
import { buildPieces, type Piece } from "./puzzle/piece"
import { buildPathCache, hitTest, renderScene } from "./render/scene"

const ROWS = 6
const COLUMNS = 6
const SEED = 42
const FILL = 0.9

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

const root = requireElement<HTMLDivElement>("#app")
const canvas = document.createElement("canvas")
root.append(canvas)
const context = require2dContext(canvas)
const image = new Image()

const pieces: Piece[] = []
let paths: ReadonlyMap<number, Path2D> = new Map()
let puzzleWidth = 0
let puzzleHeight = 0

function currentOffset(): Vec2 {
  return vec2((window.innerWidth - puzzleWidth) / 2, (window.innerHeight - puzzleHeight) / 2)
}

function fitCanvas(): void {
  const ratio = window.devicePixelRatio
  canvas.width = Math.round(window.innerWidth * ratio)
  canvas.height = Math.round(window.innerHeight * ratio)
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function render(): void {
  fitCanvas()
  context.clearRect(0, 0, window.innerWidth, window.innerHeight)
  if (image.naturalWidth === 0) {
    return
  }
  renderScene(context, image, pieces, paths, currentOffset(), puzzleWidth, puzzleHeight)
}

let renderQueued = false
function requestRender(): void {
  if (renderQueued) {
    return
  }
  renderQueued = true
  requestAnimationFrame(() => {
    renderQueued = false
    render()
  })
}

function start(): void {
  const placement = containFit(
    { width: image.naturalWidth, height: image.naturalHeight },
    { width: window.innerWidth * FILL, height: window.innerHeight * FILL },
  )
  puzzleWidth = placement.width
  puzzleHeight = placement.height
  const built = buildPieces({
    rows: ROWS,
    columns: COLUMNS,
    tileWidth: puzzleWidth / COLUMNS,
    tileHeight: puzzleHeight / ROWS,
    seed: SEED,
  })
  pieces.length = 0
  pieces.push(...built)
  paths = buildPathCache(pieces)
  requestRender()
}

const toBoard = (clientX: number, clientY: number): Vec2 => {
  const rect = canvas.getBoundingClientRect()
  return sub(vec2(clientX - rect.left, clientY - rect.top), currentOffset())
}

setupInteraction({
  canvas,
  pieces,
  toBoard,
  pick: (board) => hitTest(context, pieces, paths, board),
  requestRender,
})

image.addEventListener("load", start)
image.src = exampleUrl
window.addEventListener("resize", requestRender)
