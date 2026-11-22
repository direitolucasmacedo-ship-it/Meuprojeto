const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1640,height:624},deviceScaleFactor:2});
await p.goto('file://'+path.join(__dirname,'capa.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:path.join(__dirname,'capa-facebook-natal.png')});
// prévia: área visível no celular (centro ~1109px) e posição aproximada da foto de perfil
await p.addStyleTag({content:'body:after{content:"";position:fixed;top:0;bottom:0;left:265px;width:1109px;outline:4px dashed #f0f;}'});
const q=await b.newPage({viewport:{width:1640,height:624}});await q.goto('file://'+path.join(__dirname,'capa.html'),{waitUntil:'networkidle'});await q.evaluate(()=>document.fonts.ready);
await q.addStyleTag({content:'body:after{content:"";position:fixed;top:0;bottom:0;left:265px;width:1109px;outline:4px dashed #f0f}'});
await q.screenshot({path:'/tmp/claude-0/-home-user-Meuprojeto/76c44f9e-5280-5e09-a4d9-3ad7613847dd/scratchpad/capa-safe.png'});await b.close();})();
