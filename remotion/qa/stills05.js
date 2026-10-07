const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
const c=await selectComposition({serveUrl:b,id:'V05',browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});
for(const s of process.argv.slice(2)){const f=Math.round(parseFloat(s)*30);await renderStill({composition:c,serveUrl:b,output:'qa/v05/t'+String(s).padStart(7,'0')+'.jpg',frame:f,imageFormat:'jpeg',jpegQuality:80,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});process.stdout.write('.');}console.log('done');})().catch(e=>{console.error(e);process.exit(1)});
