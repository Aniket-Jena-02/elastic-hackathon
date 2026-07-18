// Maps a DMRC line name (as returned by the API) to fully-static Tailwind
// class names. Classes are spelled out literally (not built with template
// strings) because Tailwind's JIT content scanner only picks up class names
// that appear verbatim in source.
const LINE_STYLES = {
  Red: { text: "text-line-red", bg: "bg-line-red", border: "border-line-red" },
  Yellow: { text: "text-line-yellow", bg: "bg-line-yellow", border: "border-line-yellow" },
  Blue: { text: "text-line-blue", bg: "bg-line-blue", border: "border-line-blue" },
  Green: { text: "text-line-green", bg: "bg-line-green", border: "border-line-green" },
  Violet: { text: "text-line-violet", bg: "bg-line-violet", border: "border-line-violet" },
  Pink: { text: "text-line-pink", bg: "bg-line-pink", border: "border-line-pink" },
  Magenta: { text: "text-line-magenta", bg: "bg-line-magenta", border: "border-line-magenta" },
  Orange: { text: "text-line-orange", bg: "bg-line-orange", border: "border-line-orange" },
  Aqua: { text: "text-line-aqua", bg: "bg-line-aqua", border: "border-line-aqua" },
  Gray: { text: "text-line-gray", bg: "bg-line-gray", border: "border-line-gray" },
  Rapid: { text: "text-line-rapid", bg: "bg-line-rapid", border: "border-line-rapid" },
};

const FALLBACK = LINE_STYLES.Gray;

export function lineTextClass(lineColor) {
  return (LINE_STYLES[lineColor] || FALLBACK).text;
}

export function lineBgClass(lineColor) {
  return (LINE_STYLES[lineColor] || FALLBACK).bg;
}

export function lineBorderClass(lineColor) {
  return (LINE_STYLES[lineColor] || FALLBACK).border;
}
