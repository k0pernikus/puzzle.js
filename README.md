# Puzzle.js

A browser jigsaw puzzle. An image is cut into interlocking pieces, scattered across
the board, and you drag and rotate them back together. Written in strict TypeScript
with HTML canvas and no runtime dependencies.

**Live demo:** https://k0pernikus.github.io/puzzle.js/

## Features

- Real jigsaw shapes — interlocking Bézier tabs and blanks, generated from a seed.
- Drag pieces, rotate them, and snap neighbours with position and angle tolerance.
- Snapped pieces fuse into clusters that drag and rotate as one body.
- Assembly is relative, so the puzzle solves at any position and orientation.

## Controls

- Drag a piece or cluster to move it.
- Mouse wheel, or `[` / `]`, to rotate the piece under the cursor.

## Development

The Node version is pinned in `.tool-versions` and managed with `mise`.

```bash
npm install
npm run dev        # start the Vite dev server
npm run test       # run the Vitest unit tests
npm run typecheck  # tsc --noEmit, strict
npm run build      # production build into dist/
```

## Tech

- TypeScript (strict), Vite, Vitest.
- Canvas rendering over a seeded shape generator and a rigid-body snapping model.
- Zero runtime dependencies; static output hosted on GitHub Pages.

## Deployment

Pushing to `master` runs the GitHub Actions workflow in `.github/workflows/ci.yml`:
typecheck, tests, and build must pass, then the static site deploys to GitHub Pages.
