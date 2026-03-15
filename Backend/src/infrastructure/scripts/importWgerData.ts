import * as fs from 'fs';
import * as path from 'path';

import { mapPrimaryMuscle, mapSecondaryMuscles, mapEquipment, getAnatomicalSvgUrl } from './wgerMapper';

const WGER_BASE_PATH = path.resolve(process.cwd(), '../tmp/wger/wger');
const OUT_PATH = path.resolve(process.cwd(), 'seed_wger.sql');

async function main() {
  console.log('Starting wger catalog import script generation...');

  // 1. Load JSONs
  console.log('Loading JSON fixtures...');
  const exercisesRaw = JSON.parse(fs.readFileSync(path.join(WGER_BASE_PATH, 'exercises/fixtures/exercise-base-data.json'), 'utf8'));
  const translationsRaw = JSON.parse(fs.readFileSync(path.join(WGER_BASE_PATH, 'exercises/fixtures/translations.json'), 'utf8'));

  // 2. Build Translation Maps
  console.log('Building language maps...');
  const esTranslations = new Map<number, any>();
  const enTranslations = new Map<number, any>();

  for (const t of translationsRaw) {
    if (t.model !== 'exercises.translation') continue;
    const lang = t.fields.language;
    const exerciseId = t.fields.exercise;
    
    if (lang === 4) { // Spanish
      esTranslations.set(exerciseId, t.fields);
    } else if (lang === 2) { // English fallback
      enTranslations.set(exerciseId, t.fields);
    }
  }

  // 3. Process Exercises
  console.log('Processing exercises...');
  let importedCount = 0;
  let sqlBuilder = 'BEGIN TRANSACTION;\n';

  for (const ex of exercisesRaw) {
    if (ex.model !== 'exercises.exercise') continue;
    const id = ex.pk;
    const uuid = ex.fields.uuid;

    // Translations (Spanish first, then English)
    const translation = esTranslations.get(id) || enTranslations.get(id);
    if (!translation) continue;

    // Escape single quotes for SQL
    const escapeStr = (str: string | null) => str ? "'" + str.replace(/'/g, "''") + "'" : 'NULL';

    const name = translation.name;
    const description = translation.description;

    // Map Muscles
    const rawPrimaryMuscles: number[] = ex.fields.muscles || [];
    const rawSecondaryMuscles: number[] = ex.fields.muscles_secondary || [];

    const { primaryMuscle, primaryMuscleId } = mapPrimaryMuscle(rawPrimaryMuscles);
    const secondaryMuscles = mapSecondaryMuscles(rawSecondaryMuscles);

    // Map Equipment
    const rawEquipment: number[] = ex.fields.equipment || [];
    const equipmentStr = mapEquipment(rawEquipment);

    const anatomicalSvgUrl = getAnatomicalSvgUrl(primaryMuscleId);
    const weightIncrement = 2.5;

    // Build SQL insert string
    sqlBuilder += `INSERT OR IGNORE INTO exercises (id, name, primary_muscle, secondary_muscles, equipment, weight_increment, animation_path, description, anatomical_representation_svg) VALUES (
  ${escapeStr(uuid)},
  ${escapeStr(name)},
  ${escapeStr(primaryMuscle)},
  ${escapeStr(JSON.stringify(secondaryMuscles))},
  ${escapeStr(equipmentStr)},
  ${weightIncrement},
  NULL,
  ${escapeStr(description)},
  ${escapeStr(anatomicalSvgUrl)}
);\n`;
    importedCount++;
  }

  sqlBuilder += 'COMMIT;\n';

  // 4. Write TypeScript file using JSON.stringify
  const tsContent = `export const WGER_SEED_SQL = ${JSON.stringify(sqlBuilder)};\n`;
  const outPathTs = path.resolve(process.cwd(), 'src/infrastructure/scripts/seed_wger.ts');
  fs.writeFileSync(outPathTs, tsContent, 'utf8');

  console.log(`Done! Exported ${importedCount} INSERT statements in seed_wger.ts`);
}

main().catch(console.error);
