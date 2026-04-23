const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git' && file !== '.expo') {
                replaceInDir(fullPath);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes("'@shared'") || content.includes('"@shared"') || content.includes("'@shared/") || content.includes('"@shared/')) {
                console.log(`Updating ${fullPath}`);
                const newContent = content
                    .replace(/'@shared'/g, "'@kernel'")
                    .replace(/"@shared"/g, '"@kernel"')
                    .replace(/'@shared\//g, "'@kernel/")
                    .replace(/"@shared\//g, '"@kernel/');
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    });
}

replaceInDir('./src');
