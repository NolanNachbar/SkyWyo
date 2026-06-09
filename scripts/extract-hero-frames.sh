#!/usr/bin/env bash
# Extract the scroll-scrubbed hero frames from a source video.
#
# The CanvasHero component (src/components/hero/CanvasHero.tsx) draws these
# frames to a canvas as the page scrolls. Keep FRAME_COUNT in that file in sync
# with the COUNT below.
#
# Usage: ./scripts/extract-hero-frames.sh /path/to/source.mov
set -euo pipefail

SRC="${1:?Usage: extract-hero-frames.sh <source-video>}"
OUT="public/hero/frames"
COUNT=180          # number of frames (must match FRAME_COUNT in CanvasHero.tsx)
WIDTH=1280         # output width in px (height auto, preserves aspect)
QUALITY=6          # JPEG quality, 2 (best) .. 31 (worst)

DURATION="$(ffprobe -v error -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 "$SRC")"
FPS="$(awk "BEGIN { print $COUNT / $DURATION }")"

mkdir -p "$OUT"
rm -f "$OUT"/*.jpg

ffmpeg -y -i "$SRC" \
  -vf "fps=${FPS},scale=${WIDTH}:-2" -q:v "$QUALITY" \
  "$OUT/frame_%04d.jpg"

echo "Extracted $(ls "$OUT"/*.jpg | wc -l) frames to $OUT/"
du -sh "$OUT"
