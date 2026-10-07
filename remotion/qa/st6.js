// render V06 stills at the given seconds -> qa/v06/t<sec>.jpg, then a contact sheet
const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
const c=await selectComposition({serveUrl:b,id:'V06',browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});
require('fs').mkdirSync('qa/v06',{recursive:true});
for(const t of process.argv.slice(2)){await renderStill({composition:c,serveUrl:b,output:`qa/v06/t${t}.jpg`,frame:Math.min(c.durationInFrames-1,Math.round(+t*30)),imageFormat:'jpeg',jpegQuality:75,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});}
console.log('done');})().catch(e=>{console.error(e);process.exit(1)});
