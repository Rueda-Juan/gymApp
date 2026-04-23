const fs = require('fs');
const path = require('path');
const root = path.resolve(process.cwd(), 'src');
const dir = path.join(root, 'entities');
function walk(d, files = []) {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p, files);
    else if (/\.(ts|tsx)$/.test(f.name)) files.push(p);
  }
  return files;
}
const files = walk(dir);
let changed = 0;
for (const file of files) {
  let txt = fs.readFileSync(file, 'utf8');
  const orig = txt;
  txt = txt.replace(/from ['\"]((?:\.\.\/)+shared\/[^'\"]*)['\"]/g, (match, p) => {
    const normalized = p.replace(/\\/g, '/');
    const withoutPrefix = normalized.replace(/^(?:\.\.\/)+/, '');
    return `from '@/${withoutPrefix}'`;
  });
  if (txt !== orig) {
    fs.writeFileSync(file, txt, 'utf8');
    changed++;
    console.log('updated', path.relative(root, file));
  }
}
console.log('done', changed);
