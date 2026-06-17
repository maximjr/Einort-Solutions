const fs = require('fs');
const size = fs.statSync('public/icon.png').size;
console.log('Size:', size);
