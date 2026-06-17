export interface Size {
  readonly width: number
  readonly height: number
}

export interface Placement {
  readonly scale: number
  readonly width: number
  readonly height: number
  readonly offsetX: number
  readonly offsetY: number
}

export function containFit(content: Size, viewport: Size): Placement {
  const scale = Math.min(viewport.width / content.width, viewport.height / content.height)
  const width = content.width * scale
  const height = content.height * scale
  return {
    scale,
    width,
    height,
    offsetX: (viewport.width - width) / 2,
    offsetY: (viewport.height - height) / 2,
  }
}
