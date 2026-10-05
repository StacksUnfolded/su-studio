const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
const c=await selectComposition({serveUrl:b,id:'V04Hook',browserExecutable:process.env.HS});
for(const f of process.argv.slice(2)){const t0=Date.now();await renderStill({composition:c,serveUrl:b,output:'/tmp/claude-0/x.jpg',frame:+f,imageFormat:'jpeg',browserExecutable:process.env.HS,chromiumOptions:{gl:process.env.GL||'swangle'}});console.log(f,Date.now()-t0,'ms');}})();
