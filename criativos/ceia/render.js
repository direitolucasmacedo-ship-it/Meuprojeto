// Criativo "Ceia de Natal Econômica" — feed 1080x1080 e stories 1080x1920
const {chromium}=require('playwright');const path=require('path');
const tree=`<svg viewBox="0 0 100 120" class="tree"><polygon points="50,5 70,40 60,40 80,70 65,70 90,100 10,100 35,70 20,70 40,40 30,40" fill="#1f5e3b"/><rect x="44" y="100" width="12" height="16" fill="#5a3a1e"/></svg>`;
const book=`<div class="book"><div class="spine"></div><div class="cover"><div class="frame">
<div class="stars">✦ ✦ ✦</div><div class="kicker">GUIA PRÁTICO</div>
<div class="btitle">Ceia de Natal<br>Econômica</div><div class="bsub">Cardápio, receitas e lista de compras para 8 a 10 pessoas</div>${tree}</div></div></div>`;
const items=['Cardápio completo','Receitas passo a passo','Lista de compras com preços','Cronograma da ceia'];
const body=story=>`
<div class="top"><div class="pill">🎄 EBOOK EM PDF • ACESSO IMEDIATO</div>
<h1>Sua ceia de Natal <em>completa</em>,<br>sem estourar o orçamento</h1></div>
<div class="mid">${book}<div class="list">${items.map(i=>`<div class="it"><span class="ck">✓</span>${i}</div>`).join('')}<div class="badge">Para 8 a 10 pessoas</div></div></div>
<div class="bot"><div class="pricebox"><div class="por">Tudo isso por apenas</div><div class="price">R$ 21,90</div><div class="anchor">menos do que o prato de 1 pessoa na ceia</div></div>
<div class="cta">Quero o guia 👉</div>${story?'<div class="mini">Receba na hora no celular • Pagamento seguro</div>':''}</div>`;
const css=`*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:var(--h);font-family:Montserrat,sans-serif;overflow:hidden;background:#f6ecd9}
.c{position:relative;width:1080px;height:var(--h);display:flex;flex-direction:column;justify-content:space-between;align-items:center;padding:var(--pad) 70px;
background:radial-gradient(circle at 20% 15%,#fff8ea 0,transparent 45%),radial-gradient(circle at 85% 90%,#efdcb8 0,transparent 50%),linear-gradient(160deg,#faf1df,#ecd9b4)}
.c:before{content:"";position:absolute;inset:22px;border:3px solid #b8862f;border-radius:26px;opacity:.55}
.snow{position:absolute;color:#fff;opacity:.8;font-size:22px}
.top{display:flex;flex-direction:column;align-items:center;gap:var(--g);text-align:center;z-index:1}
.pill{background:#1f5e3b;color:#fff;font-weight:800;font-size:var(--pill);letter-spacing:2px;padding:12px 30px;border-radius:999px}
h1{font-family:'Playfair Display',serif;font-weight:800;color:#3a1f14;font-size:var(--h1);line-height:1.08}
h1 em{color:#a8202a;font-style:italic}
.mid{display:flex;flex-direction:var(--dir);align-items:center;justify-content:center;gap:var(--mg);z-index:1}
.book{position:relative;width:var(--bw);height:calc(var(--bw)*1.38);transform:rotate(-5deg);filter:drop-shadow(18px 24px 22px rgba(60,30,10,.35))}
.spine{position:absolute;left:-14px;top:6px;bottom:6px;width:22px;background:#8e1b23;border-radius:6px 0 0 6px}
.cover{position:absolute;inset:0;background:#fbf4e6;border-radius:4px 10px 10px 4px;padding:calc(var(--bw)*.06)}
.frame{height:100%;border:2px solid #b8862f;outline:1px solid #b8862f;outline-offset:-8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--bw)*.035);text-align:center;padding:10px}
.stars{color:#a8202a;font-size:calc(var(--bw)*.05);letter-spacing:6px}
.kicker{font-size:calc(var(--bw)*.04);font-weight:800;letter-spacing:3px;color:#a8202a}
.btitle{font-family:'Playfair Display',serif;font-weight:800;color:#3a1f14;font-size:calc(var(--bw)*.12);line-height:1.05}
.bsub{font-family:'Playfair Display',serif;font-style:italic;font-size:calc(var(--bw)*.042);color:#6b5040;max-width:85%}
.tree{width:calc(var(--bw)*.28)}
.list{display:flex;flex-direction:column;gap:var(--lg);align-items:var(--la)}
.it{display:flex;align-items:center;gap:16px;font-weight:700;font-size:var(--it);color:#3a1f14}
.ck{display:inline-grid;place-items:center;width:calc(var(--it)*1.3);height:calc(var(--it)*1.3);border-radius:50%;background:#1f5e3b;color:#fff;font-size:calc(var(--it)*.8);font-weight:900;flex:none}
.badge{margin-top:8px;background:#a8202a;color:#fff;font-weight:800;font-size:calc(var(--it)*.9);padding:10px 24px;border-radius:12px;transform:rotate(-2deg);align-self:var(--ba)}
.bot{display:flex;flex-direction:column;align-items:center;gap:var(--g);z-index:1}
.pricebox{text-align:center}
.por{font-weight:700;font-size:var(--por);color:#6b5040}
.price{font-family:'Playfair Display',serif;font-weight:900;font-size:var(--pr);color:#a8202a;line-height:1}
.anchor{font-weight:700;font-style:italic;font-size:var(--por);color:#1f5e3b}
.cta{background:linear-gradient(180deg,#c42b35,#8e1b23);color:#fff;font-weight:900;font-size:var(--cta);padding:20px 60px;border-radius:16px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 8px 0 #5c0f15,0 16px 26px rgba(60,20,10,.35)}
.mini{font-weight:700;font-size:26px;color:#6b5040}`;
const S={'1080x1080':{h:1080,s:0,v:'--h:1080px;--pad:56px;--g:14px;--pill:24px;--h1:62px;--dir:row;--mg:70px;--bw:300px;--lg:18px;--la:flex-start;--ba:flex-start;--it:30px;--por:26px;--pr:92px;--cta:34px'},
 '1080x1920':{h:1920,s:1,v:'--h:1920px;--pad:140px;--g:20px;--pill:30px;--h1:74px;--dir:column;--mg:50px;--bw:390px;--lg:18px;--la:flex-start;--ba:flex-start;--it:36px;--por:30px;--pr:124px;--cta:42px'}};
const snow=n=>Array.from({length:n},(_,i)=>`<span class="snow" style="left:${(i*137)%1000+30}px;top:${(i*263)%1800+20}px">✦</span>`).join('');
(async()=>{const b=await chromium.launch();
for(const [k,c] of Object.entries(S)){const p=await b.newPage({viewport:{width:1080,height:c.h}});
await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,800;0,900;1,700;1,800&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet"><style>:root{${c.v}}${css}</style></head><body><div class="c">${snow(c.s?18:10)}${body(c.s)}</div></body></html>`,{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:path.join(__dirname,`criativo-ceia-${k}.png`)});await p.close();}
await b.close();})();
