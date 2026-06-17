export const TAU = Math.PI * 2

export function normalizeAngle(angle: number): number {
  const wrapped = angle % TAU
  if (wrapped > Math.PI) {
    return wrapped - TAU
  }
  if (wrapped <= -Math.PI) {
    return wrapped + TAU
  }
  return wrapped
}

export function angleDelta(from: number, to: number): number {
  return normalizeAngle(to - from)
}
