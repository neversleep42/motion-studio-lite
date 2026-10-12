import {spawn} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import net from 'node:net';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');process.chdir(root);
for(const port of [5418,5419,5420])await new Promise((resolve,reject)=>{const s=net.createServer();s.once('error',()=>reject(Error('Port '+port+' déjà utilisé')));s.listen(port,'127.0.0.1',()=>s.close(resolve));});
const children=[];let stopping=false;
async function stop(code=0){if(stopping)return;stopping=true;await Promise.all(children.map(c=>new Promise(resolve=>{if(!c.pid){resolve();return;}if(process.platform==='win32'){const killer=spawn('taskkill.exe',['/PID',String(c.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});killer.on('exit',resolve);killer.on('error',resolve);}else{try{process.kill(-c.pid,'SIGTERM');}catch{}resolve();}})));process.exit(code);}
for(const args of [['--import','tsx','server/index.ts'],[path.join(root,'node_modules/next/dist/bin/next'),process.argv.includes('--production')?'start':'dev','--hostname','127.0.0.1','--port','5418']]){const c=spawn(process.execPath,args,{cwd:root,stdio:'inherit',windowsHide:true,detached:process.platform!=='win32'});children.push(c);c.on('exit',code=>void stop(code??0));}
process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());console.log('Motion Studio Lite : http://127.0.0.1:5418');
