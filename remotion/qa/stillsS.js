const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
for(const id of ['V05ShortA','V05ShortB']){const c=await selectComposition({serveUrl:b,id,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});
const n=c.durationInFrames;for(let k=0;k<8;k++){const f=Math.round((k+0.5)*n/8);await renderStill({composition:c,serveUrl:b,output:`qa/s_${id}_${k}.jpg`,frame:f,imageFormat:'jpeg',jpegQuality:80,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});}}
console.log('done');})().catch(e=>{console.error(e);process.exit(1)});
