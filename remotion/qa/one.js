const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});const c=await selectComposition({serveUrl:b,id:'V05',browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});
for(const t of process.argv.slice(2)){await renderStill({composition:c,serveUrl:b,output:`qa/one_${t}.jpg`,frame:Math.round(+t*30),imageFormat:'jpeg',jpegQuality:80,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});}
console.log('done');})().catch(e=>{console.error(e);process.exit(1)});
