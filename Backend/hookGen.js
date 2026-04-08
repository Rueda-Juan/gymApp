const fs = require('fs');
const path = require('path');
const hooksDir = 'c:\\Users\\Juanchi\\Desktop\\gymApp\\Backend\\src\\interface\\hooks';

function refactorHook(filename) {
    const filePath = path.join(hooksDir, filename);
    let original = fs.readFileSync(filePath, 'utf8');
    
    // Find the service name
    const svcMatch = original.match(/const \{\s*(\w+Service)\s*\} = useContainer\(\);/);
    if (!svcMatch) return;
    const serviceName = svcMatch[1];
    
    // Find all the methods destructured from useMemo (this accurately gives us all methods)
    // "return useMemo(() => ({ a, b }), [a, b]);"
    const returnMatch = original.match(/return useMemo\(\(\) => \(\{\s*([\s\S]*?)\s*\}\),/);
    if (!returnMatch) return;
    const methods = returnMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    
    let rewritten = original;
    
    // 1. Rewrite the destructurer line
    const useCaseAliasMap = methods.map(m => m + ': ' + m + 'UseCase');
    rewritten = rewritten.replace(svcMatch[0], 'const { ' + useCaseAliasMap.join(', ') + ' } = useContainer();');
    
    // 2. Rewrite each method's useCallback body
    methods.forEach(m => {
        // match: const m = useCallback(\n    (params) => service.m(params),\n    [service],\n  );
        // It could span multiple lines. We want to replace `service.m` with `mUseCase.execute`
        // and replace `[service]` with `[mUseCase]` for that specific block.
        
        // This is safe because mUseCase.execute only occurs here.
        // Actually, we can just replace `service.m(` and `service.m\n` with `mUseCase.execute`
        // carefully targeting whole string matching.
        // There is one tricky edge case: updateWorkoutExercise inside useWorkout uses execute({workoutId...})
        
        // Find the block for this method defining its `useCallback`
        const fnPattern = new RegExp('const\\s+' + m + '\\s*=\\s*useCallback\\s*\\(([\\s\\S]*?)\\);?');
        const fnMatch = rewritten.match(fnPattern);
        
        if (fnMatch) {
            let callbackBody = fnMatch[0];
            // replace `serviceName.m` with `mUseCase.execute`
            // NOTE: the dot might be surrounded by spaces in some weird format but usually not.
            callbackBody = callbackBody.replace(serviceName + '.' + m, m + 'UseCase.execute');
            
            // replace `[serviceName]` with `[mUseCase]`
            // or `[serviceName, other]` with `[mUseCase, other]`
            // since we know [serviceName] is literally there:
            callbackBody = callbackBody.replace(new RegExp('\\[' + serviceName + '\\]'), '[' + m + 'UseCase]');
            // handle multi-line params if it was `[serviceName, ...]`
            callbackBody = callbackBody.replace(new RegExp('\\[' + serviceName + '\\s*,'), '[' + m + 'UseCase,');
            
            rewritten = rewritten.replace(fnMatch[0], callbackBody);
        }
    });

    fs.writeFileSync(filePath, rewritten);
    console.log("Processed " + filename);
}

['useBackup.ts', 'useBodyWeight.ts', 'useExercises.ts', 'usePreferences.ts', 'useRoutines.ts', 'useStats.ts', 'useWorkout.ts'].forEach(f => refactorHook(f));
