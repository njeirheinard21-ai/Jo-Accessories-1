const fs = require('fs');
const path = require('path');

function replaceColors(content) {
  let newContent = content;
  
  // Replace dark backgrounds
  newContent = newContent.replace(/\bbg-\[\#0A0A0A\]\b/g, 'bg-ash');
  newContent = newContent.replace(/\bbg-gray-900\b/g, 'bg-ash');
  
  // Replace dark mode borders and texts
  newContent = newContent.replace(/\bborder-gray-900\b/g, 'border-white/10');
  newContent = newContent.replace(/\bborder-gray-800\b/g, 'border-white/10');
  newContent = newContent.replace(/\bborder-gray-700\b/g, 'border-white/20');
  newContent = newContent.replace(/\bborder-gray-600\b/g, 'border-white/20');
  
  newContent = newContent.replace(/\btext-gray-300\b/g, 'text-white/60');
  newContent = newContent.replace(/\btext-gray-200\b/g, 'text-white/40');
  newContent = newContent.replace(/\bhover:text-gray-300\b/g, 'hover:text-white');
  
  newContent = newContent.replace(/\bdivide-gray-200\b/g, 'divide-ash-light');
  newContent = newContent.replace(/\bdivide-gray-50\b/g, 'divide-ash-light');
  
  newContent = newContent.replace(/\btext-gray-700\b/g, 'text-ash');
  newContent = newContent.replace(/\bhover:text-gray-700\b/g, 'hover:text-ash/70');
  
  newContent = newContent.replace(/\bring-gray-300\b/g, 'ring-ash-light');
  newContent = newContent.replace(/\btext-gray-500\b/g, 'text-ash-muted');
  newContent = newContent.replace(/\btext-gray-400\b/g, 'text-ash-muted');
  
  return newContent;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const updated = replaceColors(content);
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
