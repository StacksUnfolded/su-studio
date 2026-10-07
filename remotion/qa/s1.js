const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
for(const [id,ts] of [['V05ShortA',[1.2,2.0]],['V05ShortB',[1.2,2.0]]]){const c=await selectComposition({serveUrl:b,id,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});
for(const t of ts){await renderStill({composition:c,serveUrl:b,output:`qa/s_${id}_t${t}.jpg`,frame:Math.round(t*30),imageFormat:'jpeg',jpegQuality:80,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});}}
console.log('done');})().catch(e=>{console.error(e);process.exit(1)});
