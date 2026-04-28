const fs = require('fs');
const path = require('path');

const files = [
    'src/pages/routines/__tests__/RoutineCreatePage.test.tsx',
    'src/pages/routines/__tests__/routineDetailPage.test.tsx',
    'src/pages/routines/RoutineCreatePage.tsx',
    'src/pages/routines/RoutineDetailPage.tsx',
    'src/pages/routines/RoutinesPage.tsx'
];

files.forEach(file => {
    const fullPath = path.join('./', file);
    if (fs.existsSync(fullPath)) {
        console.log(`Updating ${fullPath}`);
        let content = fs.readFileSync(fullPath, 'utf8');
        content = content.replace(/useRoutines/g, 'useRoutineApi');
        fs.writeFileSync(fullPath, content, 'utf8');
    } else {
        console.warn(`File not found: ${fullPath}`);
    }
});
