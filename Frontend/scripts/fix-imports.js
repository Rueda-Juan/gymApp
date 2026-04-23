const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd(), 'src');
function walk(dir, filelist = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      walk(full, filelist);
    } else if (/\.(ts|tsx)$/.test(name.name)) {
      filelist.push(full);
    }
  }
  return filelist;
}
const sharedRoot = path.join(root, 'shared');
const entitiesRoot = path.join(root, 'entities');
const files = [];
if (fs.existsSync(sharedRoot)) files.push(...walk(sharedRoot));
if (fs.existsSync(entitiesRoot)) files.push(...walk(entitiesRoot));
let changed = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const original = text;
  const dir = path.dirname(file);
  // Shared absolute imports within shared layer should be relative
  text = text.replace(/from ['\"]@\/shared\/([\w\d_\-/]+)['\"]/g, (match, importPath) => {
    const target = path.relative(dir, path.join(root, 'shared', importPath));
    let rel = target.replace(/\\/g, '/');
    if (!rel.startsWith('.')) rel = './' + rel;
    return `from '${rel}'`;
  });
  // Same-slice entity imports within entities layer should be relative
  const entityPathMatch = file.match(/src[\\/]entities[\\/]([^\\/]+)[\\/]/);
  if (entityPathMatch) {
    const slice = entityPathMatch[1];
    text = text.replace(new RegExp(`from ['\"]@/entities/${slice}(/[^'\"]*)['\"]`, 'g'), (match, subpath) => {
      const target = path.relative(dir, path.join(root, 'entities', slice, subpath));
      let rel = target.replace(/\\/g, '/');
      if (!rel.startsWith('.')) rel = './' + rel;
      return `from '${rel}'`;
    });
  }
  if (text !== original) {
    fs.writeFileSync(file, text, 'utf8');
    changed++;
    console.log('updated', path.relative(root, file));
  }
}
console.log('changed files:', changed);
