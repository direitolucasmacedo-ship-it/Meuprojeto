// Versões com foto real de salgados (foto-salgados.webp)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const foto='data:image/webp;base64,'+fs.readFileSync(path.join(__dirname,'foto-salgados.webp')).toString('base64');
const css=`*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:var(--h);background:#120c07;font-family:Montserrat,sans-serif;color:#fff4dc;overflow:hidden}
.c{position:relative;width:1080px;height:var(--h);overflow:hidden}
.ph{position:absolute;left:0;width:1080px;top:var(--pt);height:var(--ph);background:url(${foto}) center/cover;
 -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 18%,#000 72%,transparent 100%)}
.shade{position:absolute;inset:0;background:radial-gradient(circle at 0 0,rgba(227,38,47,.3),transparent 40%)}
.c:after{content:"";position:absolute;inset:22px;border:3px solid rgba(245,182,35,.6);border-radius:28px}
.top,.bot{position:absolute;left:0;right:0;display:flex;flex-direction:column;align-items:center;gap:var(--gap);padding:0 60px;text-align:center;z-index:2}
.top{top:var(--tt)}.bot{bottom:var(--bb)}
.pill{background:#e3262f;color:#fff;font-weight:900;font-size:var(--pill);letter-spacing:2px;padding:12px 32px;border-radius:999px;text-transform:uppercase;box-shadow:0 8px 24px rgba(227,38,47,.45)}
h1{font-family:Anton,sans-serif;font-weight:400;text-transform:uppercase;line-height:1.02;font-size:var(--h1);color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.6)}
h1 em{font-style:normal;color:#f5b623}
.sub{font-size:var(--sub);font-weight:700;line-height:1.3;text-wrap:balance;text-shadow:0 2px 10px #000,0 0 4px #000}.sub b{color:#ffd96a}
.box{background:rgba(18,12,7,.88);border:3px solid #f5b623;border-radius:24px;padding:20px 40px;display:flex;flex-direction:column;align-items:center;gap:14px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
.price{display:flex;align-items:baseline;gap:20px;font-weight:800}.price s{font-size:36px;opacity:.7}
.price span{font-family:Anton,sans-serif;font-size:var(--pr);color:#f5b623;line-height:1}
.cta{background:linear-gradient(180deg,#ff3a43,#c81820);color:#fff;font-weight:900;font-size:var(--cta);padding:22px 54px;border-radius:18px;text-transform:uppercase;box-shadow:0 10px 0 #7d0c12,0 18px 30px rgba(0,0,0,.5)}
.tag{background:#f5b623;color:#1a1008;font-weight:900;font-size:var(--tag);padding:12px 26px;border-radius:14px;transform:rotate(-2deg)}
.mini{font-size:var(--mini);font-weight:700;opacity:.9}`;
const natal=s=>`<div class="top"><div class="pill">🎄 Especial de Natal</div>
<h1>As encomendas de<br><em>Natal</em> já começaram</h1>
<div class="sub">Aprenda a fazer <b>salgados e doces para vender</b><br>direto da sua cozinha, mesmo começando do zero</div></div>
<div class="bot"><div class="box"><div class="mini">650 receitas • acesso imediato</div><div class="price"><s>R$ 147</s><span>R$ 27</span></div></div>
<div class="cta">Quero as receitas 👉</div></div>`;
const r650=s=>`<div class="top"><div class="pill">Salgados &amp; Doces para vender</div>
<h1><em style="font-size:1.6em;line-height:.95;display:block">650 receitas</em>de salgados e doces</h1>
<div class="sub">Coxinha, kibe, esfiha, risoles, pizza, tortas e doces</div></div>
<div class="bot"><div class="tag">🎁 BÔNUS: guia para vender no iFood</div><div class="box"><div class="price"><s>R$ 147</s><span>R$ 27</span></div></div>
<div class="cta">Ver todas as receitas 👉</div>${s?'<div class="mini">Acesso vitalício • Garantia de 7 dias</div>':''}</div>`;
const sizes={'1080x1080':{h:1080,s:0,v:'--h:1080px;--pt:300px;--ph:640px;--tt:55px;--bb:55px;--gap:14px;--pill:28px;--h1:76px;--sub:28px;--pr:84px;--cta:36px;--tag:28px;--mini:26px'},
 '1080x1920':{h:1920,s:1,v:'--h:1920px;--pt:640px;--ph:820px;--tt:150px;--bb:150px;--gap:24px;--pill:34px;--h1:108px;--sub:38px;--pr:110px;--cta:42px;--tag:34px;--mini:30px'}};
(async()=>{const b=await chromium.launch();
for(const [n,f] of [['natal',natal],['650-receitas',r650]])for(const [k,c] of Object.entries(sizes)){
 const p=await b.newPage({viewport:{width:1080,height:c.h}});
 await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Anton&family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet"><style>:root{${c.v}}${css}</style></head><body><div class="c"><div class="ph"></div><div class="shade"></div>${f(c.s)}</div></body></html>`,{waitUntil:'networkidle'});
 await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:path.join(__dirname,`criativo-foto-${n}-${k}.png`)});await p.close();}
await b.close();})();
