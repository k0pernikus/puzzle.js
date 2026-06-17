import "./style.css"

import exampleUrl from "../img/example.jpg"
import { vec2, type Vec2 } from "./geometry/vec2"
import { setupInteraction } from "./input/interaction"
import { containFit } from "./layout/fit"
import {
  isSolved,
  raiseCluster,
  rotateCluster,
  scatterBoard,
  snapCluster,
  translateCluster,
  type Board,
  type Cluster,
} from "./puzzle/board"
import { buildPieces } from "./puzzle/piece"
import { makePrng } from "./random/prng"
import { buildPathCache, pickCluster, renderBoard } from "./render/scene"

const ROWS = 6
const COLUMNS = 6
const SEED = 42
const FILL = 0.7
const ANGLE_TOLERANCE = Math.PI / 12

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

let board: Board | undefined
let paths: ReadonlyMap<number, Path2D> = new Map()
let puzzleWidth = 0
let puzzleHeight = 0
let positionTolerance = 0
let solved = false

function fitCanvas(): void {
  const ratio = window.devicePixelRatio
  canvas.width = Math.round(window.innerWidth * ratio)
  canvas.height = Math.round(window.innerHeight * ratio)
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
}

function drawBanner(): void {
  context.save()
  context.fillStyle = "rgba(240, 240, 240, 0.95)"
  context.font = "600 32px system-ui, sans-serif"
  context.textAlign = "center"
  context.textBaseline = "top"
  context.fillText("Solved", window.innerWidth / 2, 24)
  context.restore()
}

function render(): void {
  fitCanvas()
  context.clearRect(0, 0, window.innerWidth, window.innerHeight)
  if (!board) {
    return
  }
  renderBoard(context, image, board, paths, puzzleWidth, puzzleHeight)
  if (solved) {
    drawBanner()
  }
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
  positionTolerance = 0.28 * Math.min(puzzleWidth / COLUMNS, puzzleHeight / ROWS)
  const pieces = buildPieces({
    rows: ROWS,
    columns: COLUMNS,
    tileWidth: puzzleWidth / COLUMNS,
    tileHeight: puzzleHeight / ROWS,
    seed: SEED,
  })
  paths = buildPathCache(pieces)
  board = scatterBoard(pieces, vec2(window.innerWidth, window.innerHeight), makePrng(SEED + 1))
  solved = false
  requestRender()
}

const toBoard = (clientX: number, clientY: number): Vec2 => {
  const rect = canvas.getBoundingClientRect()
  return vec2(clientX - rect.left, clientY - rect.top)
}

const settle = (cluster: Cluster): void => {
  if (!board) {
    return
  }
  const merged = snapCluster(board, cluster, positionTolerance, ANGLE_TOLERANCE)
  if (merged && isSolved(board)) {
    solved = true
  }
}

setupInteraction({
  canvas,
  toBoard,
  pick: (point) => (board ? pickCluster(context, board, paths, point) : undefined),
  raise: (cluster) => {
    if (board) {
      raiseCluster(board, cluster)
    }
  },
  translate: (cluster, delta) => translateCluster(cluster, delta),
  rotate: (cluster, center, angle) => rotateCluster(cluster, center, angle),
  settle,
  requestRender,
})

image.addEventListener("load", start)
image.src = exampleUrl
window.addEventListener("resize", requestRender)
