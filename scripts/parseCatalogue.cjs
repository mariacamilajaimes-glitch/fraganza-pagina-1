const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function parse() {
  const buf = fs.readFileSync('public/assets/aistudio/catalogo_fraganza_test_35ab6155.pdf');
  const p = new PDFParse({ data: buf });
  const res = await p.getText();
  
  console.log('Total pages:', res.pages.length);
  for (let i = 0; i < 10; i++) {
    console.log(`--- Page ${i+1} (Length: ${res.pages[i].text.length}) ---`);
    console.log(res.pages[i].text.split('\n').slice(0, 8).join('\n'));
  }
}

parse().catch(console.error);
