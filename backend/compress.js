const fs = require('fs');
const path = require('path');
const zlib = require('zlib');


const dataPath = path.join(__dirname, 'src', 'data', 'data.json');
const data = fs.readFileSync(dataPath);

const compressed = zlib.gzipSync(data);


const outputPath = path.join(__dirname, 'src', 'data', 'data.json.gz');
fs.writeFileSync(outputPath, compressed);

console.log('Đã nén file data.json thành data.json.gz');