// Headless playthrough. usage: node tools/sim.js <seed> [day:HH:MM action prop who]...
// actions: examine (who examines prop), nudge (story nudge or fall), chill (who), beckon (who -> prop)
// props: K.<key> or S.<key>. who: person index. Example: node tools/sim.js cherry 2:10:05 examine S.note 0
const {chromium}=require('playwright');const path=require('path');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/opt/pw-browsers/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:320,height:200}});
p.on('pageerror',e=>console.log('ERR:',e.message,(e.stack||'').split('\n').slice(0,3).join(' | ')));
const seed=process.argv[2]||'willow'; const acts=[]; for(let i=3;i+3<process.argv.length;i+=4){const [d,h,m]=process.argv[i].split(':').map(Number);acts.push({day:d,min:h*60+m,action:process.argv[i+1],prop:process.argv[i+2],who:+process.argv[i+3],done:false});}
const file=process.env.TEST_HTML||path.join(__dirname,'..','index.html');
await p.goto('file://'+file);await p.waitForTimeout(3000);
await p.evaluate(s=>{localStorage.clear();window.__ghost.startLeap(s);},seed);await p.waitForTimeout(1500);
await p.evaluate(()=>{document.getElementById('open').click();});await p.waitForTimeout(400);
await p.evaluate(()=>{const G=window.__ghost;G.setPaused(false);G.clock.speed=240;});
const seen=new Set();
for(let i=0;i<400;i++){await p.waitForTimeout(400);
  const r=await p.evaluate((acts)=>{const G=window.__ghost,c=G.clock,S=G.story,K=G.K;const out={t:document.getElementById('clock').innerText.replace('\n',' '),subs:[...document.querySelectorAll('.sub')].map(e=>e.innerText.replace(/\n/g,': ')),ov:document.getElementById('overlay').hidden?'':document.getElementById('ocontent').innerText.slice(0,500).replace(/\n/g,' / '),clues:G.clues.join(','),state:JSON.stringify(S.state),title:S.title,era:G.era};
    // slow down 40 min before any pending action so we don't skip it
    const pend=acts.filter(a=>!a.done); if(!pend.length)c.speed=(window.__slowUntil&&(c.day*1440+c.min)<window.__slowUntil)?6:240; if(pend.length){const a=pend[0];const dmin=(a.day-c.day)*1440+(a.min-c.min); c.speed=dmin<45?6:240; if(dmin<=0){a.done=true;window.__slowUntil=c.day*1440+c.min+40;const prop=a.prop?(a.prop.startsWith('S.')?S.props[a.prop.slice(2)]:K[a.prop.slice(2)]):null;const who=G.people[a.who||0];
      if(a.action==='examine'){S.onExamine(who,prop);} else if(a.action==='nudge'){if(!(S.onNudge&&S.onNudge(prop)))G.fall(prop);} else if(a.action==='chill'){G.anomaly({type:'chill',pos:who.pos.clone(),target:who,loud:.35});S.onChill&&S.onChill(who);} else if(a.action==='beckon'){who.busy={type:'investigate',prop,arrived:false};who.pose='stand';who.sync();who.goToProp(prop);}
      out.did=a.action+' '+(a.prop||'')+' '+who.name;}}
    return out;},acts.map(a=>({...a})));
  // sync done flags back
  const doneNow=await p.evaluate(()=>window.__simDone||[]);
  for(const s of r.subs)if(!seen.has(s)){seen.add(s);console.log('   ',r.t,'|',s);}
  if(i%25===0)console.log('  ..',r.t);
  if(r.did){console.log('>>>',r.t,r.did);const idx=acts.findIndex(a=>!a.done);if(idx>=0)acts[idx].done=true;}
  if(r.ov&&r.ov.length>10&&i>5){console.log('OVERLAY',r.t,'|',r.title,r.era&&r.era.year,'\n',r.ov,'\nstate',r.state,'\nclues',r.clues);break;}}
await b.close();})();
