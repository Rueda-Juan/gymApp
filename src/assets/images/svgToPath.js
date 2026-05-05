/**
 * svgToPath.js – Node.js script
 *
 * Reads Body3.0.svg, extracts every <path> grouped by its parent <g id="...">,
 * and writes a brand-new musclePaths.ts to
 *   ../../src/entities/anatomy/lib/musclePaths.ts
 *
 * Usage:
 *   node svgToPath.js
 */

const fs = require("fs");
const path = require("path");

// ────────────────────────────────────────────────────────────
// 1. Read the SVG
// ────────────────────────────────────────────────────────────
const SVG_PATH = path.join(__dirname, "Body3.0.svg");
const svg = fs.readFileSync(SVG_PATH, "utf-8");

// ────────────────────────────────────────────────────────────
// 2. Parse every <g> and <path> using regex (no DOM needed)
// ────────────────────────────────────────────────────────────

/**
 * Build a tree of <g> elements with their id and children (nested <g> and <path>).
 * We do a simple stack-based parse of the SVG markup.
 */
function parseSvg(svgString) {
  // Collect all opening <g>, closing </g>, and <path> tags with positions
  const tokens = [];

  // Match self-closing <path ... /> or <path ...></path>
  const pathRe = /<path\b([^>]*?)\/>/g;
  let m;
  while ((m = pathRe.exec(svgString)) !== null) {
    const attrs = m[1];
    const d = extractAttr(attrs, "d");
    const id = extractAttr(attrs, "id");
    if (d) {
      tokens.push({ type: "path", pos: m.index, d, id });
    }
  }

  // Match <g ...> (opening)
  const gOpenRe = /<g\b([^>]*?)>/g;
  while ((m = gOpenRe.exec(svgString)) !== null) {
    const attrs = m[1];
    const id = extractAttr(attrs, "id");
    const serifId = extractAttr(attrs, "serif:id");
    tokens.push({ type: "g-open", pos: m.index, id: serifId || id });
  }

  // Match </g>
  const gCloseRe = /<\/g>/g;
  while ((m = gCloseRe.exec(svgString)) !== null) {
    tokens.push({ type: "g-close", pos: m.index });
  }

  // Sort tokens by position in the document
  tokens.sort((a, b) => a.pos - b.pos);

  // Walk tokens and track the group stack
  const groupStack = []; // stack of group IDs (or null)
  const pathsByGroup = {}; // groupId → string[]
  const pathsById = {}; // pathId → string (for paths with their own id, e.g. front-lines)

  for (const token of tokens) {
    if (token.type === "g-open") {
      groupStack.push(token.id || null);
    } else if (token.type === "g-close") {
      groupStack.pop();
    } else if (token.type === "path") {
      // Track paths by their own id (for front-lines, back-lines, etc.)
      if (token.id) {
        if (!pathsById[token.id]) pathsById[token.id] = [];
        pathsById[token.id].push(token.d);
      }

      // Find the closest named parent group
      let parentId = null;
      for (let i = groupStack.length - 1; i >= 0; i--) {
        if (groupStack[i]) {
          parentId = groupStack[i];
          break;
        }
      }
      if (parentId) {
        if (!pathsByGroup[parentId]) pathsByGroup[parentId] = [];
        pathsByGroup[parentId].push(token.d);
      }
    }
  }

  return { pathsByGroup, pathsById };
}

function extractAttr(attrString, name) {
  // Use word boundary \b to prevent 'd' from matching inside 'id', 'width', etc.
  const re = new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`);
  const m = re.exec(attrString);
  return m ? m[1] : null;
}

const { pathsByGroup, pathsById } = parseSvg(svg);

// ────────────────────────────────────────────────────────────
// 3. Classify paths: silhouette / lines / muscle groups
// ────────────────────────────────────────────────────────────

// Groups that are NOT muscles (silhouette parts, outline, generic containers)
const SILHOUETTE_GROUPS = [
  "front-hands-head-feet",
  "back-hands-head-feet",
];
const LINE_GROUPS = ["front-lines", "back-lines"];
const GENERIC_GROUPS = [
  "front", "back", "front-back", "body",
  "front-muscles", "back-muscles",
  "legs", "arms", "core", "chest", "delts", "abs",
  // back-side duplicates with serif:id
  "Mesa de trabajo1",
];

// Collect silhouette and line paths
const FRONT_SILHOUETTE = pathsByGroup["front-hands-head-feet"] || [];
const BACK_SILHOUETTE = pathsByGroup["back-hands-head-feet"] || [];
const FRONT_LINES = pathsById["front-lines"] || [];
const BACK_LINES = pathsById["back-lines"] || [];

// Collect muscle paths
const musclePaths = {};

// Muscle group IDs we want to pick up directly from the SVG
const MUSCLE_IDS = [
  "calves", "adductors", "quadriceps",
  "obliques", "lower-abs", "upper-abs",
  "forearms", "biceps",
  "front-delts", "side-delts", "rear-delts",
  "lower-chest", "mid-chest", "upper-chest",
  "lats", "traps", "rhomboid", "lower-back",
  "hamstrings", "glutes",
  "triceps",
  "back-traps",
];

for (const id of MUSCLE_IDS) {
  if (pathsByGroup[id]) {
    // Normalise: strip trailing digits from IDs like "calves1" → keep as-is if exact
    let key = id;
    // "back-traps" → "traps" (back view traps merge with front traps key)
    if (key === "back-traps") key = "traps";
    if (!musclePaths[key]) musclePaths[key] = [];
    musclePaths[key].push(...pathsByGroup[id]);
  }
}

// Also pick up serif:id duplicates like "calves1", "obliques1", etc.
// These are already resolved by our parser (serif:id takes priority), but some
// groups have IDs like "legs1", "arms1", "core1" which are containers.
// Their children (e.g. "hamstrings", "calves1" → serif:id = "calves") are already matched above.

// ────────────────────────────────────────────────────────────
// 4. Build composite / alias groups
// ────────────────────────────────────────────────────────────

const abs = [...(musclePaths["upper-abs"] || []), ...(musclePaths["lower-abs"] || [])];
const obliques = musclePaths["obliques"] || [];
const lowerBack = musclePaths["lower-back"] || [];

const core = [...abs, ...obliques, ...lowerBack];

const chest = [
  ...(musclePaths["upper-chest"] || []),
  ...(musclePaths["mid-chest"] || []),
  ...(musclePaths["lower-chest"] || []),
];

const lats = musclePaths["lats"] || [];
const traps = musclePaths["traps"] || [];
const rhomboid = musclePaths["rhomboid"] || [];
const midBackUnique = rhomboid; // rhomboid IS the mid-back unique identifier

const midBack = [...lats, ...rhomboid];
const upperBack = [...traps, ...rhomboid];
const back = [...lats, ...traps, ...lowerBack, ...rhomboid];

const shoulders = [
  ...(musclePaths["front-delts"] || []),
  ...(musclePaths["side-delts"] || []),
  ...(musclePaths["rear-delts"] || []),
];

const quads = musclePaths["quadriceps"] || [];
const hamstrings = musclePaths["hamstrings"] || [];
const glutes = musclePaths["glutes"] || [];
const calves = musclePaths["calves"] || [];
const adductors = musclePaths["adductors"] || [];

const legs = [...quads, ...hamstrings, ...glutes, ...calves, ...adductors];

const biceps = musclePaths["biceps"] || [];
const triceps = musclePaths["triceps"] || [];
const forearms = musclePaths["forearms"] || [];
const arms = [...biceps, ...triceps, ...forearms];

// ────────────────────────────────────────────────────────────
// 5. Generate the TypeScript file
// ────────────────────────────────────────────────────────────

function formatPaths(arr) {
  if (!arr || arr.length === 0) return "[]";
  const items = arr.map((p) => `    "${p}",`).join("\n");
  return `[\n${items}\n  ]`;
}

function formatTopLevelPaths(arr) {
  if (!arr || arr.length === 0) return "[]";
  const items = arr.map((p) => `  "${p}",`).join("\n");
  return `[\n${items}\n]`;
}

const output = `import type { MuscleGroup } from "@kernel";

export type MusclePathMap = Partial<Record<MuscleGroup, string[]>>;

export const FRONT_SILHOUETTE_PATHS = ${formatTopLevelPaths(FRONT_SILHOUETTE)};

export const FRONT_LINE_PATHS = ${formatTopLevelPaths(FRONT_LINES)};

export const BACK_SILHOUETTE_PATHS = ${formatTopLevelPaths(BACK_SILHOUETTE)};

export const BACK_LINE_PATHS = ${formatTopLevelPaths(BACK_LINES)};

const paths: Partial<Record<MuscleGroup, string[]>> = {
  // Basic groups will be combined into supergroups below
  chest: [], // Will be populated below
  "upper-chest": ${formatPaths(musclePaths["upper-chest"])},
  "mid-chest": ${formatPaths(musclePaths["mid-chest"])},
  "lower-chest": ${formatPaths(musclePaths["lower-chest"])},
  lats: ${formatPaths(lats)},
  traps: ${formatPaths(traps)},
  "upper-back": [], // Will be populated below
  "mid-back": ${formatPaths(rhomboid)},
  "lower-back": ${formatPaths(lowerBack)},
  shoulders: [], // Will be populated below
  "front-delts": ${formatPaths(musclePaths["front-delts"])},
  "side-delts": ${formatPaths(musclePaths["side-delts"])},
  "rear-delts": ${formatPaths(musclePaths["rear-delts"])},
  biceps: ${formatPaths(biceps)},
  triceps: ${formatPaths(triceps)},
  forearms: ${formatPaths(forearms)},
  quads: ${formatPaths(quads)},
  quadriceps: [], // Will be populated below
  hamstrings: ${formatPaths(hamstrings)},
  glutes: ${formatPaths(glutes)},
  adductors: ${formatPaths(adductors)},
  abductors: [], // Will be populated below
  calves: ${formatPaths(calves)},
  abs: [], // Will be populated below
  "lower-abs": ${formatPaths(musclePaths["lower-abs"])},
  "upper-abs": ${formatPaths(musclePaths["upper-abs"])},
  core: [], // Will be populated below – includes abs + obliques + lower-back
  obliques: ${formatPaths(obliques)},
  back: [], // Will be populated below
};

// 1. Core and Abs
paths.abs = [...paths["upper-abs"]!, ...paths["lower-abs"]!];
paths.core = [...paths.abs!, ...paths.obliques!, ...paths["lower-back"]!];

// 2. Chest
paths.chest = [
  ...paths["upper-chest"]!,
  ...paths["mid-chest"]!,
  ...paths["lower-chest"]!,
];

// 3. Back (Additive to avoid duplication)
const midBackUnique = paths["mid-back"]!; // Store unique paths before we expand it
paths["mid-back"] = [...paths.lats!, ...midBackUnique];
paths["upper-back"] = [...paths.traps!, ...midBackUnique];
paths.back = [
  ...paths.lats!,
  ...paths.traps!,
  ...paths["lower-back"]!,
  ...midBackUnique,
];

// 4. Shoulders
paths.shoulders = [
  ...paths["front-delts"]!,
  ...paths["side-delts"]!,
  ...paths["rear-delts"]!,
];

// 5. Legs
paths.legs = [
  ...paths.quads!,
  ...paths.hamstrings!,
  ...paths.glutes!,
  ...paths.calves!,
  ...paths.adductors!,
];
paths.quadriceps = [...paths.quads!];
paths.abductors = [...paths.adductors!];

// 6. Arms
paths.arms = [...paths.biceps!, ...paths.triceps!, ...paths.forearms!];

export const MUSCLE_PATHS = paths;
`;

// ────────────────────────────────────────────────────────────
// 6. Write the output file
// ────────────────────────────────────────────────────────────
const OUTPUT_PATH = path.join(
  __dirname,
  "..",
  "..",
  "src",
  "entities",
  "anatomy",
  "lib",
  "musclePaths.ts"
);

fs.writeFileSync(OUTPUT_PATH, output, "utf-8");

// ── Summary ──
const groups = Object.keys(musclePaths);
console.log("✅  musclePaths.ts generated successfully!");
console.log(`    Output: ${OUTPUT_PATH}`);
console.log(`    Front silhouette paths: ${FRONT_SILHOUETTE.length}`);
console.log(`    Back silhouette paths:  ${BACK_SILHOUETTE.length}`);
console.log(`    Front line paths:       ${FRONT_LINES.length}`);
console.log(`    Back line paths:        ${BACK_LINES.length}`);
console.log(`    Muscle groups extracted: ${groups.length}`);
for (const g of groups.sort()) {
  console.log(`      ${g}: ${musclePaths[g].length} paths`);
}