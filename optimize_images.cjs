const fs = require('fs');
const path = require('path');

function optimizeImages(content, isHero) {
  let newContent = content;
  
  if (isHero) {
    // Add loading="eager" fetchPriority="high"
    newContent = newContent.replace(/<img(?![^>]*loading=)/g, '<img loading="eager" fetchPriority="high"');
  } else {
    // Add loading="lazy" decoding="async"
    newContent = newContent.replace(/<img(?![^>]*loading=)/g, '<img loading="lazy" decoding="async"');
  }
  
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
      
      const isHero = fullPath.includes('HeroSection') || fullPath.includes('Header') || fullPath.includes('Checkout');
      
      const updated = optimizeImages(content, isHero);
      if (content !== updated) {
        fs.writeFileSync(fullPath, updated, 'utf8');
        console.log(`Updated images in ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
