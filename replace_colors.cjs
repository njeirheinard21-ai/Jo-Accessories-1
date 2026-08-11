const fs = require('fs');
const path = require('path');

function replaceColors(content) {
  let newContent = content;
  
  // Replace black with ash
  newContent = newContent.replace(/\bbg-black\b/g, 'bg-ash');
  newContent = newContent.replace(/\btext-black\b/g, 'text-ash');
  newContent = newContent.replace(/\bborder-black\b/g, 'border-ash');
  newContent = newContent.replace(/\bring-black\b/g, 'ring-ash');
  newContent = newContent.replace(/\bhover:text-black\b/g, 'hover:text-ash');
  newContent = newContent.replace(/\bhover:border-black\b/g, 'hover:border-ash');
  newContent = newContent.replace(/\bhover:bg-black\b/g, 'hover:bg-ash');
  newContent = newContent.replace(/\bselection:bg-black\b/g, 'selection:bg-ash');
  
  // Replace dark grays with ash
  newContent = newContent.replace(/\btext-gray-900\b/g, 'text-ash');
  newContent = newContent.replace(/\btext-gray-800\b/g, 'text-ash');
  newContent = newContent.replace(/\bhover:text-gray-900\b/g, 'hover:text-ash');
  newContent = newContent.replace(/\bhover:text-gray-800\b/g, 'hover:text-ash');
  
  // Replace hover states for buttons
  newContent = newContent.replace(/\bhover:bg-gray-900\b/g, 'hover:bg-ash/90');
  newContent = newContent.replace(/\bhover:bg-gray-800\b/g, 'hover:bg-ash/90');
  
  // Replace off-whites with white
  newContent = newContent.replace(/\bbg-gray-50\b/g, 'bg-white');
  newContent = newContent.replace(/\bbg-gray-100\b/g, 'bg-white');
  newContent = newContent.replace(/\bbg-\[\#FAFAFA\]\b/g, 'bg-white');
  newContent = newContent.replace(/\bbg-\[\#f8f8f8\]\b/g, 'bg-white');

  // Replace muted texts with ash-muted
  newContent = newContent.replace(/\btext-gray-500\b/g, 'text-ash-muted');
  newContent = newContent.replace(/\btext-gray-400\b/g, 'text-ash-muted');
  newContent = newContent.replace(/\btext-gray-600\b/g, 'text-ash-muted');
  
  // Replace borders with ash-light
  newContent = newContent.replace(/\bborder-gray-200\b/g, 'border-ash-light');
  newContent = newContent.replace(/\bborder-gray-100\b/g, 'border-ash-light');
  newContent = newContent.replace(/\bborder-gray-300\b/g, 'border-ash-light');
  newContent = newContent.replace(/\bhover:border-gray-200\b/g, 'hover:border-ash-light');
  newContent = newContent.replace(/\bhover:border-gray-300\b/g, 'hover:border-ash');
  
  // Replace specific text colors inside classes
  newContent = newContent.replace(/#111/g, '#2C3039');
  
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
