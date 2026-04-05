const fs = require('fs');

// Check slide layout relationships to understand what each slide uses
for (let i = 1; i <= 7; i++) {
  const rels = fs.readFileSync(`docs/user_template_extracted/ppt/slides/_rels/slide${i}.xml.rels`, 'utf8');
  const layoutMatch = rels.match(/slideLayout(\d+)/);
  const imageMatches = [...rels.matchAll(/Target="[^"]*?(image\d+\.\w+)"/g)];
  console.log(`Slide ${i}: Layout ${layoutMatch ? layoutMatch[1] : '?'}, Images: ${imageMatches.map(m => m[1]).join(', ') || 'none'}`);
}

// Check theme colors
const theme = fs.readFileSync('docs/user_template_extracted/ppt/theme/theme1.xml', 'utf8');
const clrRe = /srgbClr val="([A-Fa-f0-9]+)"/g;
const colors = [];
let m;
while ((m = clrRe.exec(theme)) !== null) colors.push(m[1]);
console.log('\nTheme colors:', [...new Set(colors)].join(', '));

// Check presentation size
const pres = fs.readFileSync('docs/user_template_extracted/ppt/presentation.xml', 'utf8');
const sizeMatch = pres.match(/sldSz cx="(\d+)" cy="(\d+)"/);
if (sizeMatch) {
  console.log(`\nSlide size: ${Math.round(parseInt(sizeMatch[1])/914400*100)/100}" x ${Math.round(parseInt(sizeMatch[2])/914400*100)/100}"`);
}
