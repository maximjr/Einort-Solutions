import fs from 'fs';
const dirs = [
  'src/components/ui',
  'src/components/layouts',
  'src/components/sections',
  'src/components/forms',
  'src/components/dashboard',
  'src/components/shared'
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    console.log('Created ' + d);
  }
});
