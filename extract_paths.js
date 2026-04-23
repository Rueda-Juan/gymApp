const fs = require('fs');
const xml = fs.readFileSync('Frontend/assets/images/Body3.0.svg', 'utf8');

const regexGroup = /<g id="([^"]+)">([\s\S]*?)<\/g>/g;
const regexPath = /<path [^>]*d="([^"]+)"[^>]*>/g;

const result = {};

let groupMatch;
while ((groupMatch = regexGroup.exec(xml)) !== null) {
  const groupId = groupMatch[1];
  const groupContent = groupMatch[2];
  
  // Skip top level groups that contain children groups to avoid duplicates if possible, 
  // or just capture everything and we'll filter.
  const paths = [];
  let pathMatch;
  while ((pathMatch = regexPath.exec(groupContent)) !== null) {
    paths.push(pathMatch[1]);
  }
  
  if (paths.length > 0) {
    result[groupId] = paths;
  }
}

// Special capture for top level paths NOT in groups if any (header/footer/etc)
const topPaths = [];
let topMatch;
// This is naive but works for a flat structure
while ((topMatch = regexPath.exec(xml)) !== null) {
    // Only if not already captured? 
}

const finalResult = JSON.stringify(result, null, 2);
fs.writeFileSync('paths_data.json', finalResult, 'utf8');
console.log('Extraction complete: paths_data.json');
