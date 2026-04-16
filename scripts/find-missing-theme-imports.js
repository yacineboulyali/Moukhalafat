const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

const appDir = path.join(__dirname, '../app');
const tFiles = getAllFiles(appDir);

const missingImports = [];

tFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('THEME.') && !content.includes('import { THEME }') && !content.includes('import {THEME}')) {
      missingImports.push(file);
  }
});

console.log(JSON.stringify(missingImports, null, 2));
