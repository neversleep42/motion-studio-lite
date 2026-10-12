"use client";
import {useState} from 'react';
import {examples} from '../examples';
export default function Page(){
 const [code,setCode]=useState(examples[0].code),[snapshot,setSnapshot]=useState<{id:string;url:string;code:string}|null>(null),[busy,setBusy]=useState(''),[error,setError]=useState(''),[download,setDownload]=useState('');
 async function request(route:string,body:unknown){const r=await fetch('/api/'+route,{method:'POST',headers:{'Content-Type':'application/json','x-motion-lite':'1'},body:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw Error(data.error||'Opération impossible');return data;}
 async function preview(){setBusy('Préparation de l’aperçu…');setError('');setDownload('');try{const result=await request('preview',{code});setSnapshot({...result,code});}catch(e){setError(String(e));}finally{setBusy('');}}
 async function render(){if(!snapshot)return;setBusy('Export MP4 en cours…');setError('');try{const result=await request('export',{id:snapshot.id});setDownload(result.url);}catch(e){setError(String(e));}finally{setBusy('');}}
 const stale=snapshot?.code!==code;
 return <main><header><div className="brand"><span className="mark">m.</span><span>motion studio <b>lite</b></span></div><span className="local">● Atelier local</span></header>
 <section className="intro"><p className="eyebrow">DU CODE AU MOUVEMENT</p><h1>Une idée.<br/><span>Six secondes pour jouer.</span></h1><p>Modifie un exemple Remotion, regarde le résultat et exporte ton animation.</p></section>
 <section className="workbench"><div className="editor"><div className="bar"><strong>Composition.tsx</strong><label>Exemple <select aria-label="Choisir un exemple" disabled={!!busy} defaultValue="0" onChange={e=>{setCode(examples[Number(e.target.value)].code);setDownload('');}}>{examples.map((e,i)=><option key={e.name} value={i}>{e.name}</option>)}</select></label></div><textarea aria-label="Code de la composition" spellCheck={false} value={code} disabled={!!busy} onChange={e=>{setCode(e.target.value);setDownload('');}}/><div className="editor-footer"><span>React + Remotion</span><button disabled={!!busy} onClick={()=>void preview()}>Actualiser l’aperçu ↗</button></div></div>
 <div className="output"><div className="bar"><strong>Aperçu</strong><span>1280 × 720 · 30 fps</span></div><div className="screen">{snapshot?<iframe title="Aperçu Remotion" src={snapshot.url} sandbox="allow-scripts"/>:<div className="empty"><span>▶</span><p>Ton animation commence ici.</p><small>Lance l’aperçu depuis l’éditeur.</small></div>}</div><div className="export"><p>{snapshot&&stale?'Le code a changé. Actualise l’aperçu.':'6 secondes · format paysage · MP4'}</p><button disabled={!!busy||!snapshot||stale} onClick={()=>void render()}>Exporter MP4 ↓</button>{download&&<a href={download}>Télécharger le MP4</a>}</div></div></section>
 <div className="status" role="status">{busy||'Prêt à créer.'}</div>{error&&<p className="error" role="alert">{error}</p>}
 <footer><span>Un atelier volontairement simple.</span><span>Code · Aperçu · Export</span></footer></main>;
}
