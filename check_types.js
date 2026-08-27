const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('src');
let foundError = false;
for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  // Match `export { ... }` but not `export type { ... }`
  const exportRegex = /export\s+(?!type\b)\{([^}]+)\}/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const exportedBlock = match[1];
    const exportedItems = exportedBlock
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
      .map(s => s.split(' as ')[0].trim()); // handle `export { A as B }`

    for (const item of exportedItems) {
      const isType = new RegExp(`type\\s+${item}\\b`).test(content);
      const isInterface = new RegExp(`interface\\s+${item}\\b`).test(content);
      const isImportedAsType = new RegExp(`import\\s+type\\s+\\{[^}]*\\b${item}\\b[^}]*\\}`).test(content);
      const isImportedAsType2 = new RegExp(`import\\s+type\\s+${item}\\b`).test(content);

      if (isType || isInterface || isImportedAsType || isImportedAsType2) {
        console.log(`Suspicious type export in ${file}: ${item}`);
        foundError = true;
      }
    }
  }
}

if (!foundError) {
  console.log('No issues found!');
}
