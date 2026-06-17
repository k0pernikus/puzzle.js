import type { Vec2 } from "../geometry/vec2"
import { add, rotate, scale, sub } from "../geometry/vec2"
import type { Prng } from "../random/prng"
import { at } from "../util/array"
import type { CubicSegment, Edge } from "./types"

const KNOB_DEPTH = 0.066
const KNOB_JITTER = 0.02

export function straightEdge(start: Vec2, end: Vec2): Edge {
  const span = sub(end, start)
  return {
    start,
    segments: [
      {
        control1: add(start, scale(span, 1 / 3)),
        control2: add(start, scale(span, 2 / 3)),
        end,
      },
    ],
  }
}

export function knobEdge(start: Vec2, end: Vec2, prng: Prng): Edge {
  const along = sub(end, start)
  const perpendicular = rotate(along, Math.PI / 2)
  const bulge = prng.bool() ? 1 : -1
  const a = prng.uniform(-KNOB_JITTER, KNOB_JITTER)
  const b = prng.uniform(-KNOB_JITTER, KNOB_JITTER)
  const c = prng.uniform(-KNOB_JITTER, KNOB_JITTER)
  const d = prng.uniform(-KNOB_JITTER, KNOB_JITTER)
  const e = prng.uniform(-KNOB_JITTER, KNOB_JITTER)
  const t = KNOB_DEPTH

  const point = (alongFraction: number, depthFraction: number): Vec2 =>
    add(add(start, scale(along, alongFraction)), scale(perpendicular, bulge * depthFraction))

  const segments: CubicSegment[] = [
    {
      control1: point(0.2, a),
      control2: point(0.5 + b + d, -t + c),
      end: point(0.5 - t + b, t + c),
    },
    {
      control1: point(0.5 - 2 * t + b - d, 3 * t + c),
      control2: point(0.5 + 2 * t + b - d, 3 * t + c),
      end: point(0.5 + t + b, t + c),
    },
    {
      control1: point(0.5 + b + d, -t + c),
      control2: point(0.8, e),
      end: point(1, 0),
    },
  ]
  return { start, segments }
}

export function reverseEdge(edge: Edge): Edge {
  const points = [edge.start, ...edge.segments.map((segment) => segment.end)]
  const segments = edge.segments
    .map((segment, index) => ({
      control1: segment.control2,
      control2: segment.control1,
      end: at(points, index),
    }))
    .reverse()
  return {
    start: at(points, points.length - 1),
    segments,
  }
}
