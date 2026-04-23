const fs = require('fs');
const data = JSON.parse(fs.readFileSync('paths_data.json', 'utf8'));

const muscleGroupMapping = {
  'chest': ['chest', 'mid-chest', 'lower-chest1', 'left-lower-chest', 'mid-chest1'],
  'upper-chest': ['upper-chest', 'upper-chest1'],
  'mid-chest': ['mid-chest', 'mid-chest1'],
  'lower-chest': ['left-lower-chest', 'lower-chest1'],
  'lats': ['lats'],
  'upper-back': ['traps', 'back-traps', 'rhomboid'],
  'mid-back': ['lats'], // Simplifying, lats cover a lot
  'lower-back': ['lower-back'],
  'shoulders': ['delts', 'rear-delts', 'side-delts', 'front-delts'],
  'front-delts': ['front-delts'],
  'side-delts': ['side-delts'],
  'rear-delts': ['rear-delts'],
  'biceps': ['biceps'],
  'triceps': ['triceps'],
  'forearms': ['forearms'],
  'quads': ['quadriceps'],
  'hamstrings': ['hamstrings'],
  'glutes': ['glutes'],
  'calves': ['calves'],
  'abs': ['abs', 'lower-abs', 'upper-abs'],
  'core': ['core', 'obliques'],
  'traps': ['traps', 'back-traps'],
  'back': ['back-traps', 'lats', 'lower-back', 'rhomboid'],
  'legs': ['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors']
};

let tsContent = "import type { MuscleGroup } from '@shared';\n\n";

// Silhouettes
tsContent += "export const FRONT_SILHOUETTE_PATHS = " + JSON.stringify(data['front-hands-head-feet'] || data['body'] || [], null, 2) + ";\n\n";
tsContent += "export const FRONT_LINE_PATHS = " + JSON.stringify(data['front-lines'] || [], null, 2) + ";\n\n";
tsContent += "export const BACK_SILHOUETTE_PATHS = " + JSON.stringify(data['back-hands-head-feet'] || [], null, 2) + ";\n\n";
tsContent += "export const BACK_LINE_PATHS = " + JSON.stringify(data['back-lines'] || [], null, 2) + ";\n\n";

// Muscle Paths
tsContent += "export const MUSCLE_PATHS: Partial<Record<MuscleGroup, string[]>> = {\n";

for (const [group, svgIds] of Object.entries(muscleGroupMapping)) {
  let paths = [];
  svgIds.forEach(id => {
    if (data[id]) {
        paths = paths.concat(data[id]);
    }
  });
  tsContent += `  '${group}': ${JSON.stringify(paths, null, 4)},\n`;
}

tsContent += "};\n";

fs.writeFileSync('Frontend/src/widgets/anatomy/lib/musclePaths.ts', tsContent, 'utf8');
console.log('Generated musclePaths.ts successfully');
