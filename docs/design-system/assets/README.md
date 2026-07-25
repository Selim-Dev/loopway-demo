# Brand assets

**This folder is intentionally empty of raster logos.**

The design projects ship three PNG exports — `loopway-mark.png` (mark only,
transparent), `loopway-logo.png` (horizontal), `loopway-full.png` (lockup).
All three exceed the design API's 256 KiB per-read limit and come back
truncated, so they could not be extracted programmatically.

In the meantime the brand mark is drawn as a vector by
`packages/ui/src/icons/Icon.tsx` → `LoopwayMark`, using the loop geometry the
design's own thumbnail template ships:

```
stroke  #2ECC71 (var(--lw-green-500))
caps    round
path    M-150 0 a75 75 0 1 1 150 0 a75 75 0 1 0 150 0
```

`LoopwayMark` takes a `color` prop — pass `#fff` when it sits on a green or
navy fill (the Admin sidebar tile does this).

## To restore the raster logos

1. Download the three PNGs from the design system project
   (`772e5514-4469-4e1e-a3c9-283179feb956` → `assets/logos/`).
2. Drop them here **and** in `apps/b2b/public/brand/` and
   `apps/admin/public/brand/`.
3. Swap `LoopwayMark` for an `<img>` in `IconRail` and `NavSidebar`.
4. Tick off deviation **D-1** in
   [../11-design-source-map.md](../11-design-source-map.md).
