const fs = require('fs');
const path = require('path');
const base = 'docs/user_template_extracted/ppt/slides';

for (let i = 1; i <= 7; i++) {
  const xml = fs.readFileSync(path.join(base, 'slide' + i + '.xml'), 'utf8');
  console.log('=== SLIDE ' + i + ' ===');

  // Colors
  const fills = [];
  const fillRe = /srgbClr val="([A-Fa-f0-9]+)"/g;
  let m;
  while ((m = fillRe.exec(xml)) !== null) fills.push(m[1]);
  console.log('Colors:', [...new Set(fills)].join(', '));

  // Font sizes
  const szRe = /sz="(\d+)"/g;
  const sizes = [];
  while ((m = szRe.exec(xml)) !== null) sizes.push(parseInt(m[1]) / 100);
  console.log('Sizes:', [...new Set(sizes)].sort((a, b) => b - a).join(', '));

  // Positions
  const offRe = /<a:off x="(\d+)" y="(\d+)"/g;
  const positions = [];
  while ((m = offRe.exec(xml)) !== null) {
    positions.push({ x: Math.round(parseInt(m[1]) / 914400 * 100) / 100, y: Math.round(parseInt(m[2]) / 914400 * 100) / 100 });
  }
  console.log('Pos:', JSON.stringify(positions));

  // Extents
  const extRe = /<a:ext cx="(\d+)" cy="(\d+)"/g;
  const extents = [];
  while ((m = extRe.exec(xml)) !== null) {
    extents.push({ w: Math.round(parseInt(m[1]) / 914400 * 100) / 100, h: Math.round(parseInt(m[2]) / 914400 * 100) / 100 });
  }
  console.log('Ext:', JSON.stringify(extents));

  // Background
  const bgMatch = xml.match(/<p:bg>[\s\S]*?<\/p:bg>/);
  if (bgMatch) {
    const bgColors = [];
    const bcRe = /srgbClr val="([A-Fa-f0-9]+)"/g;
    while ((m = bcRe.exec(bgMatch[0])) !== null) bgColors.push(m[1]);
    console.log('BG Colors:', bgColors.join(', '));
  }
  console.log('');
}
