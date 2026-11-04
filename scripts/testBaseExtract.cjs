const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function extractAll() {
  const buf = fs.readFileSync('public/assets/aistudio/catalogo_fraganza_test_35ab6155.pdf');
  const parser = new PDFParse({ data: buf });
  const doc = await parser.getText();
  const pages = doc.pages;

  console.log(`Loaded ${pages.length} pages.`);

  // Section 1: Pages 0 to 7 (Base info: id, code, name, brand)
  const baseItems = [];
  const codeRegex = /\b([CUD]-\d{3})\b/;

  for (let pIdx = 0; pIdx < 8; pIdx++) {
    const lines = pages[pIdx].text.split('\n').map(l => l.trim()).filter(Boolean);
    for (const line of lines) {
      if (line.includes('ID Código Nombre') || line.includes('CATÁLOGO SIMPLIFICADO') || line.includes('Versión cliente')) continue;
      // Match line format: "<num> <CODE> <NAME> <BRAND>"
      const match = line.match(/^(\d+)\s+([CUD]-\d{3})\s+(.+)$/);
      if (match) {
        const id = parseInt(match[1]);
        const code = match[2];
        const rest = match[3].trim();
        baseItems.push({ id, code, rest });
      }
    }
  }

  console.log(`Base items parsed: ${baseItems.length}`);
  if (baseItems.length !== 207) {
    console.log('Sample base items:', baseItems.slice(0, 5), 'last:', baseItems.slice(-3));
  }
}

extractAll().catch(console.error);
