// node qa/s6at.js V06ShortB 8.0 12.2 ...  -> qa/v06/<id>_<sec>.jpg
const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
const [id,...ts]=process.argv.slice(2);
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
const o={browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}};const c=await selectComposition({serveUrl:b,id,...o});
for(const t of ts){await renderStill({composition:c,serveUrl:b,output:`qa/v06/${id}_${t}.jpg`,frame:Math.round(t*30),imageFormat:'jpeg',jpegQuality:80,...o});}
console.log('done');})().catch(e=>{console.error(e);process.exit(1)});
