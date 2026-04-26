import xlsx from 'xlsx';
import * as fs from 'fs';

const workbook = xlsx.readFile('./1001_Motivational_Quotes.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet);

fs.writeFileSync('./src/quotes.json', JSON.stringify(data, null, 2));
console.log('Quotes written to src/quotes.json. Found ' + data.length + ' rows.');
