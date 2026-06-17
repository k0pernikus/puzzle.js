import { compose, placing, rotateAround, type Rigid } from "../geometry/transform"
import { add, midpoint, type Vec2 } from "../geometry/vec2"
import type { Prng } from "../random/prng"
import { at } from "../util/array"
import type { Piece } from "./piece"
import { areAdjacent, posesAlign } from "./snap"

export interface Cluster {
  readonly id: number
  members: number[]
  pose: Rigid
}

export interface Board {
  readonly pieces: readonly Piece[]
  readonly clusters: Cluster[]
  readonly byPiece: Map<number, Cluster>
}

export function scatterBoard(pieces: readonly Piece[], area: Vec2, prng: Prng): Board {
  const clusters: Cluster[] = pieces.map((piece) => ({
    id: piece.id,
    members: [piece.id],
    pose: placing(
      piece.pivot,
      { x: prng.uniform(area.x * 0.08, area.x * 0.92), y: prng.uniform(area.y * 0.08, area.y * 0.92) },
      prng.uniform(0, Math.PI * 2),
    ),
  }))
  const byPiece = new Map<number, Cluster>()
  for (const cluster of clusters) {
    for (const id of cluster.members) {
      byPiece.set(id, cluster)
    }
  }
  return { pieces, clusters, byPiece }
}

export function raiseCluster(board: Board, cluster: Cluster): void {
  const index = board.clusters.indexOf(cluster)
  if (index < 0) {
    return
  }
  board.clusters.splice(index, 1)
  board.clusters.push(cluster)
}

export function translateCluster(cluster: Cluster, delta: Vec2): void {
  cluster.pose = {
    rotation: cluster.pose.rotation,
    translation: add(cluster.pose.translation, delta),
  }
}

export function rotateCluster(cluster: Cluster, center: Vec2, angle: number): void {
  cluster.pose = compose(rotateAround(center, angle), cluster.pose)
}

function aligns(
  board: Board,
  a: Cluster,
  b: Cluster,
  positionTolerance: number,
  angleTolerance: number,
): boolean {
  for (const idA of a.members) {
    for (const idB of b.members) {
      const pieceA = at(board.pieces, idA)
      const pieceB = at(board.pieces, idB)
      if (!areAdjacent(pieceA, pieceB)) {
        continue
      }
      const seam = midpoint(pieceA.pivot, pieceB.pivot)
      if (posesAlign(a.pose, b.pose, seam, positionTolerance, angleTolerance)) {
        return true
      }
    }
  }
  return false
}

function absorb(board: Board, anchor: Cluster, others: readonly Cluster[]): void {
  for (const other of others) {
    for (const id of other.members) {
      anchor.members.push(id)
      board.byPiece.set(id, anchor)
    }
    const index = board.clusters.indexOf(other)
    if (index >= 0) {
      board.clusters.splice(index, 1)
    }
  }
}

export function snapCluster(
  board: Board,
  active: Cluster,
  positionTolerance: number,
  angleTolerance: number,
): boolean {
  const partners = board.clusters.filter(
    (other) => other !== active && aligns(board, active, other, positionTolerance, angleTolerance),
  )
  if (partners.length === 0) {
    return false
  }
  const group = [active, ...partners]
  const anchor = group.reduce((best, cluster) =>
    cluster.members.length > best.members.length ? cluster : best,
  )
  absorb(
    board,
    anchor,
    group.filter((cluster) => cluster !== anchor),
  )
  raiseCluster(board, anchor)
  return true
}

export function isSolved(board: Board): boolean {
  return board.clusters.length === 1
}
