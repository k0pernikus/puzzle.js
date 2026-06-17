import type { Vec2 } from "./vec2"
import { add, negate, rotate, sub } from "./vec2"

export interface Rigid {
  readonly rotation: number
  readonly translation: Vec2
}

export const IDENTITY: Rigid = {
  rotation: 0,
  translation: { x: 0, y: 0 },
}

export function apply(transform: Rigid, point: Vec2): Vec2 {
  return add(rotate(point, transform.rotation), transform.translation)
}

export function compose(outer: Rigid, inner: Rigid): Rigid {
  return {
    rotation: outer.rotation + inner.rotation,
    translation: add(outer.translation, rotate(inner.translation, outer.rotation)),
  }
}

export function invert(transform: Rigid): Rigid {
  const rotation = -transform.rotation
  return {
    rotation,
    translation: rotate(negate(transform.translation), rotation),
  }
}

export function rotateAround(center: Vec2, angle: number): Rigid {
  return {
    rotation: angle,
    translation: sub(center, rotate(center, angle)),
  }
}

export function placing(point: Vec2, target: Vec2, rotation: number): Rigid {
  return {
    rotation,
    translation: sub(target, rotate(point, rotation)),
  }
}
