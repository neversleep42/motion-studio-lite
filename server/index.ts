import express from 'express';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {bundle} from '@remotion/bundler';
import {renderMedia,selectComposition,makeCancelSignal} from '@remotion/renderer';
import {format} from '../src/examples';
import {validateCode,validId} from './source';
const root=path.resolve('.runtime'),app=express(),media=express();
await mkdir(root,{recursive:true});
app.use((req,res,next)=>{const origin=req.get('origin');if((origin&&!['http://127.0.0.1:5418','http://localhost:5418'].includes(origin))||(!['GET','HEAD'].includes(req.method)&&req.get('x-motion-lite')!=='1')){res.status(403).json({error:'Client local requis.'});return;}next();});
app.use(express.json({limit:'100kb'}));
let busy=false;
app.get('/api/health',(_req,res)=>res.json({service:'motion-studio-lite'}));
app.post('/api/preview',async(req,res)=>{
 if(busy){res.status(409).json({error:'Une opération est en cours.'});return;}busy=true;
 try{
  const code=validateCode(req.body.code),id=randomUUID(),dir=path.join(root,id);
  await mkdir(dir);await writeFile(path.join(dir,'Composition.tsx'),code);
  const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {Player} from '@remotion/player';import Composition from './Composition';
  class Boundary extends React.Component {state={error:''};static getDerivedStateFromError(e){return {error:String(e)}}render(){return this.state.error?<pre>{this.state.error}</pre>:this.props.children}}
  createRoot(document.getElementById('root')).render(<Boundary><Player component={Composition} compositionWidth={1280} compositionHeight={720} fps={30} durationInFrames={180} controls loop style={{width:'100%'}} acknowledgeRemotionLicense/></Boundary>);`;
  await writeFile(path.join(dir,'preview.tsx'),entry);
  await build({entryPoints:[path.join(dir,'preview.tsx')],bundle:true,platform:'browser',format:'iife',jsx:'automatic',outfile:path.join(dir,'preview.js'),define:{'process.env.NODE_ENV':'"production"'},logLevel:'silent'});
  await writeFile(path.join(dir,'index.html'),'<!doctype html><html lang="fr"><meta charset="utf-8"><style>body{margin:0;background:#171c20;color:white}pre{white-space:pre-wrap;padding:20px}</style><div id="root"></div><script src="preview.js"></script></html>');
  await writeFile(path.join(dir,'render.tsx'),`import React from 'react';import {registerRoot,Composition as R} from 'remotion';import Composition from './Composition';registerRoot(()=> <R id="Video" component={Composition} {...${JSON.stringify(format)}}/>);`);
  res.json({id,url:`http://127.0.0.1:5420/${id}/index.html`});
 }finally{busy=false;}
});
app.post('/api/export',async(req,res)=>{
 if(busy){res.status(409).json({error:'Une opération est en cours.'});return;}
 if(!validId(req.body.id)){res.status(400).json({error:'Aperçu invalide.'});return;}
 busy=true;const dir=path.join(root,req.body.id);const {cancelSignal,cancel}=makeCancelSignal();let timer:ReturnType<typeof setTimeout>|undefined;
 try{await access(path.join(dir,'render.tsx'));const serveUrl=await bundle({entryPoint:path.join(dir,'render.tsx'),outDir:path.join(dir,'bundle')});const composition=await selectComposition({serveUrl,id:'Video'});timer=setTimeout(cancel,180000);await renderMedia({serveUrl,composition,codec:'h264',outputLocation:path.join(dir,'video.mp4'),cancelSignal,concurrency:2,logLevel:'error'});res.json({url:`/api/download/${req.body.id}`});}
 finally{if(timer)clearTimeout(timer);busy=false;}
});
app.get('/api/download/:id',(req,res)=>{if(!validId(req.params.id)){res.status(404).end();return;}res.download(path.join(root,req.params.id,'video.mp4'),'motion-studio-lite.mp4',{dotfiles:'allow'});});
media.use((_req,res,next)=>{res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; img-src data: blob:; media-src blob:; font-src data:; connect-src 'none'; frame-ancestors http://127.0.0.1:5418 http://localhost:5418");res.setHeader('X-Content-Type-Options','nosniff');next();});
media.get('/:id/:file',(req,res)=>{if(!validId(req.params.id)||!['index.html','preview.js'].includes(req.params.file)){res.status(404).end();return;}res.sendFile(path.join(root,req.params.id,req.params.file),{dotfiles:'allow'});});
app.use((e:Error,_req:express.Request,res:express.Response,_next:express.NextFunction)=>res.status(400).json({error:e.message}));
app.listen(5419,'127.0.0.1');media.listen(5420,'127.0.0.1');
console.log('Motion Studio Lite API : 5419 · aperçu : 5420');
