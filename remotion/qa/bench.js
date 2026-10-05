const {bundle}=require('@remotion/bundler');const {renderMedia,selectComposition}=require('@remotion/renderer');
(async()=>{const b=await bundle({entryPoint:require('path').resolve('src/index.ts')});
const c=await selectComposition({serveUrl:b,id:'V04Hook',browserExecutable:process.env.HS});
const [a,z]=process.argv.slice(2).map(Number);const t0=Date.now();
await renderMedia({composition:c,serveUrl:b,codec:'h264',outputLocation:'/tmp/claude-0/bench.mp4',frameRange:[a,z],concurrency:2,browserExecutable:process.env.HS,chromiumOptions:{gl:process.env.GL||'swangle'},muted:true});
console.log('frames',z-a+1,'sec',(Date.now()-t0)/1000,'per frame',(Date.now()-t0)/1000/(z-a+1));})();
