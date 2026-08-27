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

const files = walk('src').concat(walk('pages'));
let foundError = false;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Match `export { ... }` (ignoring export type { ... } and export { ... } from ...)
  const exportRegex = /export\s+(?!type\b)\{([^}]+)\}(?!\s+from)/g;
  let match;
  while ((match = exportRegex.exec(content)) !== null) {
    const exportedBlock = match[1];

    const exportedItems = exportedBlock
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
      .map(s => s.split(' as ')[0].trim());

    for (const item of exportedItems) {
      if (item.startsWith('type ')) continue; // e.g. export { type X }

      // Check if it's declared as a type in this file
      const isType = new RegExp(`(?:^|\\s)type\\s+${item}\\s*(?:=|\\<)`).test(content);
      const isInterface = new RegExp(`(?:^|\\s)interface\\s+${item}\\s*(?:\\{|\\<|extends)`).test(content);
      
      // Check if it's imported as a type in this file
      const isImportedAsType = new RegExp(`import\\s+type\\s+\\{[^}]*\\b${item}\\b[^}]*\\}`).test(content);
      const isImportedAsType2 = new RegExp(`import\\s+type\\s+${item}\\b`).test(content);
      // Check if imported using inline type `import { type X }`
      const isImportedAsInlineType = new RegExp(`import\\s+\\{[^}]*\\btype\\s+${item}\\b[^}]*\\}`).test(content);

      if (isType || isInterface || isImportedAsType || isImportedAsType2 || isImportedAsInlineType) {
        console.log(`Missing 'export type' for ${item} in ${file}`);
        foundError = true;
      }
    }
  }
}

if (!foundError) {
  console.log('No internal type export issues found!');
}
