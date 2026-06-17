import { describe, expect, it } from "vitest"

import { IDENTITY } from "../geometry/transform"
import { vec2 } from "../geometry/vec2"
import { type Board, type Cluster, isSolved, snapCluster } from "./board"
import { buildPieces } from "./piece"

function singletonBoard(rows: number, columns: number): Board {
  const pieces = buildPieces({ rows, columns, tileWidth: 100, tileHeight: 100, seed: 1 })
  const clusters: Cluster[] = pieces.map((piece) => ({
    id: piece.id,
    members: [piece.id],
    pose: IDENTITY,
  }))
  const byPiece = new Map<number, Cluster>()
  clusters.forEach((cluster) => {
    cluster.members.forEach((id) => byPiece.set(id, cluster))
  })
  return { pieces, clusters, byPiece }
}

function clusterAt(board: Board, index: number): Cluster {
  const cluster = board.clusters[index]
  if (!cluster) {
    throw new Error(`no cluster at ${index}`)
  }
  return cluster
}

describe("snapCluster", () => {
  it("merges two adjacent pieces that share the solved frame", () => {
    const board = singletonBoard(1, 2)
    expect(snapCluster(board, clusterAt(board, 1), 5, 0.1)).toBe(true)
    expect(board.clusters).toHaveLength(1)
    expect(isSolved(board)).toBe(true)
  })

  it("leaves clusters separate when they are far apart", () => {
    const board = singletonBoard(1, 2)
    const second = clusterAt(board, 1)
    second.pose = { rotation: 0, translation: vec2(500, 0) }
    expect(snapCluster(board, second, 5, 0.1)).toBe(false)
    expect(board.clusters).toHaveLength(2)
  })

  it("absorbs both neighbours when the middle piece bridges them", () => {
    const board = singletonBoard(1, 3)
    expect(snapCluster(board, clusterAt(board, 1), 5, 0.1)).toBe(true)
    expect(board.clusters).toHaveLength(1)
    expect(clusterAt(board, 0).members.slice().sort((a, b) => a - b)).toEqual([0, 1, 2])
  })
})
