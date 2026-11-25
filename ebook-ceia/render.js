// Gera o PDF final: node render.js  (rode antes: python3 build.py)
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs'), path = require('path');

const DIR = __dirname;
const HTML = 'file://' + path.join(DIR, 'ceia-natal-economica-v2.html');
const TMP = fs.mkdtempSync(path.join(require('os').tmpdir(), 'ceia-'));
const OUT = path.join(DIR, 'ceia-natal-economica-edicao-completa.pdf');

const footer = `<div style="width:100%;font-family:Inter,Helvetica,sans-serif;font-size:7px;color:#8a7f70;text-align:center;letter-spacing:.08em">
  CEIA DE NATAL ECONÔMICA &nbsp;·&nbsp; <span class="pageNumber"></span></div>`;

async function bodyPdf(page, file, tocMap, hideTok) {
  await page.evaluate(([m, h]) => {
    document.querySelectorAll('.pg').forEach(e => { const v = m[e.dataset.pg]; e.textContent = v ? String(v) : '00'; });
    document.querySelectorAll('.tok').forEach(e => e.style.display = h ? 'none' : '');
  }, [tocMap, hideTok]);
  await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: true,
                   headerTemplate: '<span></span>', footerTemplate: footer });
}

function findTokens(file) {
  const n = parseInt(execFileSync('pdfinfo', [file]).toString().match(/Pages:\s+(\d+)/)[1]);
  const map = {};
  for (let i = 1; i <= n; i++) {
    const t = execFileSync('pdftotext', ['-f', String(i), '-l', String(i), file, '-']).toString();
    for (const m of t.matchAll(/@@([\w-]+)@@/g)) if (!(m[1] in map)) map[m[1]] = i; // número = página final (o "dummy" vira a capa)
  }
  return { map, n };
}

(async () => {
  const b = await chromium.launch();
  const page = await b.newPage();
  await page.goto(HTML, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);

  // 1) capa, sem margem e sem rodapé
  await page.addStyleTag({ content: 'body>*:not(.cover){display:none!important}' , });
  await page.pdf({ path: path.join(TMP, 'capa.pdf'), preferCSSPageSize: true, printBackground: true, pageRanges: '1' });

  // 2) miolo: esconde a capa; o "dummy" ocupa a página 1 para a numeração começar em 2
  await page.reload({ waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '.cover{display:none!important}' });
  const p1 = path.join(TMP, 'miolo1.pdf');
  await bodyPdf(page, p1, {}, false);
  const r1 = findTokens(p1);
  const p2 = path.join(TMP, 'miolo2.pdf');
  await bodyPdf(page, p2, r1.map, false);
  const r2 = findTokens(p2);
  if (JSON.stringify(r1.map) !== JSON.stringify(r2.map)) throw new Error('paginação mudou entre as passadas');
  const p3 = path.join(TMP, 'miolo3.pdf');
  await bodyPdf(page, p3, r2.map, true);
  await b.close();

  execFileSync('python3', ['-I', '-c', `
import sys
from pypdf import PdfReader, PdfWriter
w = PdfWriter()
w.add_page(PdfReader(sys.argv[1]).pages[0])
m = PdfReader(sys.argv[2])
for p in m.pages[1:]: w.add_page(p)
w.add_metadata({"/Title": "Ceia de Natal Econômica — Edição Completa", "/Author": "Ebooks Práticos"})
w.write(sys.argv[3])
`, path.join(TMP, 'capa.pdf'), p3, OUT]);
  const missing = Array.from(new Set(Object.keys(r2.map))).length;
  console.log('PDF:', OUT, '| páginas:', r2.n, '| itens no sumário:', missing);
  console.log(JSON.stringify(r2.map));
})();
