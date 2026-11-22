const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1080}});
await p.goto('file://'+path.join(__dirname,'logo.html'),{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
await p.screenshot({path:path.join(__dirname,'logo-natal-1080.png')});
await p.addStyleTag({content:'body:after{content:"";position:fixed;inset:0;background:radial-gradient(circle at 50% 50%,transparent 539px,#fff 540px)}'});
await p.screenshot({path:path.join(__dirname,'preview-circulo.png')});await b.close();})();
