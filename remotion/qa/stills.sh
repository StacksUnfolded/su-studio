#!/bin/bash
# render a list of frames in one browser session via a tiny node script
node -e "
const {bundle}=require('@remotion/bundler');const {renderStill,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
const c=await selectComposition({serveUrl:b,id:'V04Hook',browserExecutable:process.env.HS});
for(const f of process.argv.slice(1)){await renderStill({composition:c,serveUrl:b,output:'qa/f'+f+'.jpg',frame:+f,imageFormat:'jpeg',jpegQuality:85,browserExecutable:process.env.HS,chromiumOptions:{gl:'angle'}});console.log('ok',f);}})();
" "$@"
