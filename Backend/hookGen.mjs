import fs from 'fs';
import path from 'path';

const hooksDir = 'c:/Users/Juanchi/Desktop/gymApp/Backend/src/interface/hooks';

['useBackup.ts', 'useBodyWeight.ts', 'useExercises.ts', 'usePreferences.ts', 'useRoutines.ts', 'useStats.ts', 'useWorkout.ts'].forEach(filename => {
    const filePath = path.join(hooksDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const svcMatch = content.match(/const \{\s*(\w+Service)\s*\} = useContainer\(\);/);
    if (!svcMatch) return;
    const serviceName = svcMatch[1];
    
    const returnMatch = content.match(/return useMemo\(\(\) => \(\{\s*([\s\S]*?)\s*\}\),/);
    if (!returnMatch) return;
    const methods = returnMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    
    // 1. Destructurer
    const destruct = 'const { ' + methods.map(m => `${m}: ${m}UseCase`).join(', ') + ' } = useContainer();';
    content = content.replace(svcMatch[0], destruct);
    
    // 2. Methods
    methods.forEach(m => {
        // Find the block
        const regexStr = `const\\s+${m}\\s*=\\s*useCallback\\s*\\(([\\s\\S]*?),\\s*\\[(.*?)\\]\\s*\\);`;
        const regex = new RegExp(regexStr);
        content = content.replace(regex, (match, body, deps) => {
            // inside body, replace serviceName.m with mUseCase.execute
            let newBody = body.replace(new RegExp(`${serviceName}\\.${m}\\b`, 'g'), `${m}UseCase.execute`);
            // inside deps, replace serviceName with mUseCase
            let newDeps = deps.replace(new RegExp(`\\b${serviceName}\\b`, 'g'), `${m}UseCase`);
            
            return `const ${m} = useCallback(${newBody}, [${newDeps}]);`;
        });
    });

    fs.writeFileSync(filePath, content);
    console.log('Processed', filename);
});
