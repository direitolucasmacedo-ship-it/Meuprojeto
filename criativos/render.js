const {chromium}=require('playwright');const fs=require('fs');
const tpl=fs.readFileSync(__dirname+'/template.html','utf8');
const ring=(items)=>items.map((e,i)=>{const a=i/items.length*2*Math.PI-Math.PI/2;return `<div class="e" style="left:calc(50% + ${Math.cos(a)*36}% - 10%);top:calc(50% + ${Math.sin(a)*36}% - 10%)">${e}</div>`}).join('');
const natal=(story)=>`
<div class="pill">🎄 Especial de Natal</div>
<h1>As encomendas de<br><em>Natal</em> já começaram</h1>
<div class="sub">Aprenda a fazer <b>salgados e doces para vender</b> direto da sua cozinha, mesmo começando do zero</div>
<div class="tray">${ring(['🥟','🍕','🧁','🍔','🍰','🥧','🍩','🍪'])}<div class="e center" style="position:static">🎄</div></div>
<div class="foot">${story?'<div class="mini">650 receitas • acesso imediato no celular</div>':''}
<div class="price"><s>R$ 147</s><span>R$ 27</span></div>
<div class="cta">Quero as receitas 👉</div></div>`;
const r650=(story)=>`
<div class="pill">Salgados &amp; Doces para vender</div>
<div style="text-align:center"><div class="big650">650</div><h1 style="font-size:var(--h1b)">receitas que <em>vendem</em></h1></div>
<div class="chips">${['🥟 Coxinha','🫓 Esfiha','🧆 Kibe','🥐 Risoles','🧀 Bolinha de queijo','🍕 Pizza','🍔 Hambúrguer gourmet','🥧 Tortas','🍰 Doces'].map(c=>`<div class="chip">${c}</div>`).join('')}</div>
<div class="bonus">🎁 BÔNUS: guia para vender no iFood</div>
<div class="foot"><div class="price"><s>R$ 147</s><span>R$ 27</span></div>
<div class="cta">Ver todas as receitas 👉</div>${story?'<div class="mini">Acesso vitalício • Garantia de 7 dias</div>':''}</div>`;
const sizes={feed:{h:1080,vars:'--h:1080px;--pad:60px;--h1:84px;--sub:32px;--tray:300px;--n:230px;--h1b:70px;--chip:28px'},
 story:{h:1920,vars:'--h:1920px;--pad:170px;--h1:118px;--sub:42px;--tray:560px;--n:360px;--h1b:96px;--chip:36px'}};
(async()=>{const b=await chromium.launch();
for(const [name,fn] of [['natal',natal],['650-receitas',r650]])for(const [s,cfg] of Object.entries(sizes)){
 const p=await b.newPage({viewport:{width:1080,height:cfg.h},deviceScaleFactor:1});
 const html=tpl.replace('__BODY__',fn(s==='story')).replace('<body>',`<body style="${cfg.vars}">`).replace(':root{',`:root{${cfg.vars};`);
 await p.setContent(html,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
 await p.screenshot({path:`${__dirname}/criativo-${name}-${s==='feed'?'1080x1080':'1080x1920'}.png`});await p.close();}
await b.close();})();
