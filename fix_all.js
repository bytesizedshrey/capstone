const fs = require('fs');
const path = require('path');

const walkSync = (dir, callback) => {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      walkSync(filepath, callback);
    } else if (stats.isFile() && filepath.endsWith('.jsx')) {
      callback(filepath);
    }
  }
};

walkSync('/workspace/src/pages', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf-8');
  let newContent = content.replace(/\.\.\/\.\.\/components/g, '../components');
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf-8');
    console.log('Fixed', filepath);
  }
});

walkSync('/workspace/src/sections', (filepath) => {
  let content = fs.readFileSync(filepath, 'utf-8');
  let newContent = content.replace(/\.\.\/\.\.\/\.\.\/components/g, '../../components');
  if (content !== newContent) {
    fs.writeFileSync(filepath, newContent, 'utf-8');
    console.log('Fixed', filepath);
  }
});
