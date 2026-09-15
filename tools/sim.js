const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium',args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage({viewport:{width:900,height:600}});
p.on('pageerror',e=>console.log('ERR:',e.message,(e.stack||'').split('\n').slice(0,3).join(' | ')));
const seed=process.argv[2]||'hill street', act=process.argv[3]||'none';
await p.goto('file://'+__dirname+'/../index.html');await p.waitForTimeout(3000);
await p.evaluate(s=>{localStorage.clear();window.__ghost.startLeap(s);},seed);await p.waitForTimeout(1500);
await p.evaluate(()=>{document.getElementById('open').click();});await p.waitForTimeout(500);
await p.evaluate(()=>{const G=window.__ghost;G.setPaused(false);G.clock.speed=240;});
const seen=new Set(); let acted=false;
for(let i=0;i<200;i++){await p.waitForTimeout(500);
  const r=await p.evaluate((act)=>{const G=window.__ghost;const c=G.clock;const out={t:document.getElementById('clock').innerText.replace('\n',' '),day:c.day,min:c.min,subs:[...document.querySelectorAll('.sub')].map(e=>e.innerText.replace(/\n/g,': ')),ov:document.getElementById('overlay').hidden?'':document.getElementById('ocontent').innerText.slice(0,400).replace(/\n/g,' / '),clues:G.clues.join(','),state:JSON.stringify(G.story.state)};
    const actT=(act==='chill'||act==='examine')?7*60+15:16*60+45; if(act!=='none'&&c.day===2&&c.min>=actT&&!window.__acted){window.__acted=true;c.speed=4;const S=G.story,K=G.K;
      if(act==='chill'){window.__chillAt=1;out.did='armed chill';}
      if(act==='examine'){S.onExamine(G.people[1],S.bottle);out.did='examine bottle by '+G.people[1].name;}
      if(act==='nudge'){out.did='nudge:'+S.onNudge(K.hallTable);}
      if(act==='beckon'){const who=G.people[0];who.busy={type:'investigate',prop:K.hallTable,arrived:false};who.goToProp(K.hallTable);out.did='beckon '+who.name;}
      if(act==='gate'){out.did='gate:'+S.onNudge(K.gate);}
      if(act==='fix'){S.onExamine(G.people[0],K.gate);out.did='fix';}
    }
    if(window.__chillAt&&c.min>=7*60+21&&!window.__chilled){window.__chilled=1;G.story.onChill(G.people[0]);out.did='chill '+G.people[0].name+' busy='+JSON.stringify(G.people[0].busy);}
    if(act!=='none'&&c.day===2&&c.min>=((act==='chill'||act==='examine')?7*60+29:17*60+30)&&window.__acted&&!window.__sp){window.__sp=1;c.speed=240;}
    return out;},act);
  for(const s of r.subs)if(!seen.has(s)){seen.add(s);console.log('   ',r.t,'SUB',s);}
  if(i%10===0)console.log("  t=",r.t,"paused",r.state);
  if(r.did)console.log('>>>',r.t,r.did);
  if(r.ov&&r.ov.length>10&&i>5){console.log('OVERLAY',r.t,r.ov,'\nstate',r.state,'\nclues',r.clues);break;}}
await b.close();})();
