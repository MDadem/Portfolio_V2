import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pdfPath = path.join(__dirname, '..', 'public', 'Adem_cv_final.pdf');
const outPath = path.join(__dirname, '..', 'src', 'cv', 'pdf-data.js');

const pdf = fs.readFileSync(pdfPath);
const b64 = pdf.toString('base64');

// Export just the raw base64 string (safe chars only: A-Z a-z 0-9 + / =)
fs.writeFileSync(outPath, 'export default "' + b64 + '";\n');

console.log('Generated', outPath);
console.log('PDF size:', pdf.length, 'bytes');
console.log('Base64 size:', b64.length, 'chars');
