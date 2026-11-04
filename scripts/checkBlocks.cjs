const fs = require('fs');
const { PDFParse } = require('pdf-parse');

async function checkBlocks() {
  const buf = fs.readFileSync('public/assets/aistudio/catalogo_fraganza_test_35ab6155.pdf');
  const parser = new PDFParse({ data: buf });
  const doc = await parser.getText();
  const pages = doc.pages;

  const expectedCounts = [26, 29, 29, 29, 29, 29, 29, 7];

  function cleanPageLines(pIdx, headerFilter) {
    const raw = pages[pIdx].text.split('\n').map(l => l.trim()).filter(Boolean);
    return raw.filter(l => 
      !l.includes('CATÁLOGO SIMPLIFICADO') && 
      !l.includes('Versión cliente') &&
      !l.includes('Popularidad') &&
      !l.includes('Aromas Clave') &&
      !l.includes('Notas de Salida') &&
      !l.includes('Notas de Corazón') &&
      !l.includes('Notas de Fondo') &&
      !l.includes('Sensación Olfativa') &&
      !l.includes('Rango de Edad') &&
      !l.includes('Ocasión de Uso') &&
      !l.includes('Descriptores Clave') &&
      !l.includes('Explicación Sencilla')
    );
  }

  for (let b = 0; b < 11; b++) {
    const start = b * 8;
    let blockLines = [];
    for (let p = 0; p < 8; p++) {
      const pIdx = start + p;
      if (pIdx >= pages.length) break;
      const lines = cleanPageLines(pIdx);
      blockLines.push(...lines);
    }
    console.log(`Block ${b+1} (pages ${start+1}-${start+8}): count = ${blockLines.length}, sample first: "${blockLines[0]}", last: "${blockLines[blockLines.length-1]}"`);
  }
}

checkBlocks().catch(console.error);
