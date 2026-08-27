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

  // Match `export { ... } from ...`
  const exportFromRegex = /export\s+(?!type\b)\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = exportFromRegex.exec(content)) !== null) {
    const exportedBlock = match[1];
    const fromModule = match[2];

    const exportedItems = exportedBlock
      .split(',')
      .map(s => s.trim())
      .filter(s => s)
      .map(s => s.split(' as ')[0].trim());

    for (const item of exportedItems) {
      if (item.startsWith('type ')) continue; // This one is explicitly marked as type!

      // To know if it's a type, we'd have to look at the other file.
      // We can just log everything that is exported and see if it looks like a type.
      // Types often start with uppercase and end with Type, Props, Interface, etc.
      if (/^[A-Z][a-zA-Z0-9]*(Props|State|ContextType|Config|Params|Options|Type|Ref)$/.test(item)) {
        console.log(`Potential type re-export in ${file}: ${item} from ${fromModule}`);
        foundError = true;
      }
    }
  }
}

if (!foundError) {
  console.log('No issues found!');
}
