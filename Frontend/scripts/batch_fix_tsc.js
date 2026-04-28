const fs = require('fs');
const path = require('path');

const replacements = [
    { from: /useRoutines/g, to: 'useRoutineApi' },
    { from: /useExercises/g, to: 'useExerciseApi' },
    { from: /from '@\/entities\/workout'/g, to: "from '@/shared/api'" },
    { from: /from '@\/entities\/routine'/g, to: "from '@/shared/api'" },
    { from: /from '@\/features\/exercise'/g, to: "from '@/shared/api'" },
];

const filesToUpdate = [
    'src/features/dashboardSummary/useHomeData.ts',
    'src/features/dashboardSummary/model/useHomeData.ts',
    'src/pages/exercise/__tests__/ExerciseCreatePage.test.tsx',
    'src/pages/exercise/__tests__/ExerciseListPage.test.tsx',
    'src/pages/exercise/ExerciseListPage.tsx',
    'src/pages/history/__tests__/HistoryPage.test.tsx'
];

filesToUpdate.forEach(file => {
    const fullPath = path.join('./', file);
    if (fs.existsSync(fullPath)) {
        console.log(`Updating ${fullPath}`);
        let content = fs.readFileSync(fullPath, 'utf8');
        replacements.forEach(r => {
            content = content.replace(r.from, r.to);
        });
        fs.writeFileSync(fullPath, content, 'utf8');
    } else {
        console.warn(`File not found: ${fullPath}`);
    }
});
