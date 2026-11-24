const $=s=>document.querySelector(s),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const KINDS={block:{n:'Block',sh:'box',role:'solid',sx:8,sy:1,sz:8,c:'#3a6ff0',y:1},sphere:{n:'Sphere',sh:'sphere',role:'solid',sx:6,sy:6,sz:6,c:'#e8453c',y:3},cyl:{n:'Cylinder',sh:'cyl',role:'solid',sx:6,sy:2,sz:6,c:'#2fb35a',y:1},spawn:{n:'Spawn',sh:'box',role:'spawn',sx:4,sy:.4,sz:4,c:'#00b06f',y:.2},coin:{n:'Coin',sh:'cyl',role:'coin',sx:2,sy:.3,sz:2,c:'#ffc928',y:3},kill:{n:'Kill brick',sh:'box',role:'kill',sx:8,sy:1,sz:8,c:'#ff2a2a',y:.5},check:{n:'Checkpoint',sh:'box',role:'check',sx:6,sy:.4,sz:6,c:'#3a9bff',y:.2},goal:{n:'Goal',sh:'sphere',role:'goal',sx:3,sy:3,sz:3,c:'#ffd700',y:3}};
const ROLES=['solid','spawn','coin','kill','check','goal'],SHAPES=['box','sphere','cyl'],RI={solid:'&#x1F9F1;',spawn:'&#x1F4CD;',coin:'&#x1FA99;',kill:'&#x2620;',check:'&#x1F6A9;',goal:'&#x1F3C6;'};
let objs=[],M={},sel=null,nid=1,mode='edit',gname='My Game';
let R,sc,cam,hb,clock,yaw=.8,pitch=.55,dist=45;const tg=new THREE.Vector3(0,2,0);
const get=id=>objs.find(o=>o.id===id);
function toast(m){const t=$('#tt');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)}
function build(o){const g=o.sh==='sphere'?new THREE.SphereGeometry(.5,16,12):o.sh==='cyl'?new THREE.CylinderGeometry(.5,.5,1,20):new THREE.BoxGeometry(1,1,1);
 const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:o.c,emissive:o.role==='kill'?0x550000:(o.role==='goal'||o.role==='coin')?0x443300:0}));m.userData.id=o.id;m.rotation.order='YXZ';upd(o,m);return m}
function upd(o,m){m.position.set(o.x,o.y,o.z);m.scale.set(o.sx,o.sy,o.sz);m.rotation.x=o.role==='coin'?Math.PI/2:0;m.material.color.set(o.c)}
function rebuild(o){sc.remove(M[o.id]);M[o.id]=build(o);sc.add(M[o.id])}
function addObj(o){o.id=nid++;objs.push(o);M[o.id]=build(o);sc.add(M[o.id]);return o}
function clear(){objs.forEach(o=>sc.remove(M[o.id]));objs=[];M={};sel=null}
function hl(){const o=get(sel);if(o&&M[sel]&&mode==='edit'){hb.setFromObject(M[sel]);hb.visible=true}else hb.visible=false}
function select(id){sel=id;tree();props();hl()}
function add(k){const o=addObj(Object.assign({},KINDS[k],{x:Math.round(tg.x),z:Math.round(tg.z)}));o.y=KINDS[k].y;upd(o,M[o.id]);select(o.id)}
function del(){const o=get(sel);if(!o)return toast('Select something first');sc.remove(M[o.id]);delete M[o.id];objs=objs.filter(x=>x!==o);select(null)}
function dup(){const o=get(sel);if(!o)return toast('Select something first');const c=addObj(Object.assign({},o,{x:o.x+2,z:o.z+2}));select(c.id)}
function tree(){$('#tree').innerHTML=objs.length?objs.map(o=>'<button class="ti'+(o.id===sel?' on':'')+'" data-id="'+o.id+'">'+RI[o.role]+' '+esc(o.n)+'</button>').join(''):'<p class="hint">Empty. Add something from the toolbar.</p>'}
function props(){const o=get(sel);if(!o){$('#props').innerHTML='<p class="hint">Tap an object in the viewport or the Explorer to edit it.</p>';return}
 const f=(k,l,st)=>'<label>'+l+'<input type="number" step="'+(st||1)+'" data-f="'+k+'" value="'+o[k]+'"></label>',opt=(a,v)=>a.map(x=>'<option'+(x===v?' selected':'')+'>'+x+'</option>').join('');
 $('#props').innerHTML='<label>Name<input data-f="n" value="'+esc(o.n)+'" maxlength="24"></label><label>Type<select data-f="role">'+opt(ROLES,o.role)+'</select></label><label>Shape<select data-f="sh">'+opt(SHAPES,o.sh)+'</select></label><div class="g3">'+f('x','X')+f('y','Y')+f('z','Z')+'</div><div class="g3">'+f('sx','Width',.5)+f('sy','Height',.5)+f('sz','Depth',.5)+'</div><label>Colour<input type="color" data-f="c" value="'+o.c+'"></label><div class="nud">'+['x','y','z'].map(a=>'<span>'+a.toUpperCase()+' <button data-n="'+a+'" data-d="-1">-</button><button data-n="'+a+'" data-d="1">+</button></span>').join('')+'</div>'}
$('#tree').onclick=e=>{const b=e.target.closest('.ti');if(b)select(+b.dataset.id)};
$('#props').oninput=e=>{const f=e.target.dataset.f,o=get(sel);if(!f||!o)return;let v=e.target.value;
 if(f==='x'||f==='y'||f==='z')v=parseFloat(v)||0;else if(f==='sx'||f==='sy'||f==='sz')v=Math.max(.1,parseFloat(v)||.1);
 o[f]=v;if(f==='sh'||f==='role')rebuild(o);else upd(o,M[o.id]);if(f==='n')tree();hl()};
$('#props').onclick=e=>{const b=e.target.closest('button[data-n]'),o=get(sel);if(!b||!o)return;o[b.dataset.n]+=+b.dataset.d;upd(o,M[o.id]);props();hl()};
$('#gn').oninput=e=>{gname=e.target.value.slice(0,30)};
// ---- files ----
const GK='bloxverse_studio_games',strip=o=>{const r=Object.assign({},o);delete r.id;delete r.got;return r};
const store=()=>{try{return JSON.parse(localStorage.getItem(GK)||'{}')}catch(e){return {}}};
const ser=()=>JSON.stringify({format:'bloxverse-studio',v:1,name:gname,objs:objs.map(strip)},null,1);
function sanitize(o){const n=(v,d,a,b)=>Number.isFinite(+v)?clamp(+v,a,b):d;return{n:String(o.n||'Part').slice(0,24),sh:SHAPES.indexOf(o.sh)>=0?o.sh:'box',role:ROLES.indexOf(o.role)>=0?o.role:'solid',x:n(o.x,0,-2000,2000),y:n(o.y,0,-2000,2000),z:n(o.z,0,-2000,2000),sx:n(o.sx,1,.1,500),sy:n(o.sy,1,.1,500),sz:n(o.sz,1,.1,500),c:/^#[0-9a-f]{6}$/i.test(o.c)?o.c:'#888888'}}
function loadData(d){if(!d||!Array.isArray(d.objs))throw new Error('bad');clear();gname=String(d.name||'My Game').slice(0,30);$('#gn').value=gname;d.objs.slice(0,500).forEach(o=>addObj(sanitize(o)));select(null)}
function save(){gname=$('#gn').value.trim()||'My Game';const s=store();s[gname]=JSON.parse(ser());try{localStorage.setItem(GK,JSON.stringify(s));toast('Saved "'+gname+'"')}catch(e){toast('Could not save (storage is blocked)')}}
function dlg(h){const d=$('#dlg');d.innerHTML='<div class="mb">'+h+'<div class="mbb"><button id="dx">Close</button></div></div>';d.classList.add('on');$('#dx').onclick=()=>d.classList.remove('on')}
$('#dlg').onclick=e=>{const d=$('#dlg');if(e.target===d)d.classList.remove('on');const b=e.target.closest('button[data-o],button[data-x]');if(!b)return;const s=store();
 if(b.dataset.o){try{loadData(s[b.dataset.o]);d.classList.remove('on');toast('Opened "'+gname+'"')}catch(x){toast('Could not open that game')}}
 else{delete s[b.dataset.x];try{localStorage.setItem(GK,JSON.stringify(s))}catch(x){}openDlg()}};
function openDlg(){const k=Object.keys(store());dlg('<h2>Open a game</h2>'+(k.length?k.map(n=>'<div class="row"><button data-o="'+esc(n)+'">'+esc(n)+'</button><button data-x="'+esc(n)+'">Delete</button></div>').join(''):'<p>No saved games yet. Press Save first.</p>'))}
function dl(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ser()],{type:'application/json'}));a.download=(gname.replace(/[^a-z0-9_-]+/gi,'_')||'game')+'.bloxgame.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1500);toast('Exported')}
$('#fi').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{loadData(JSON.parse(r.result));toast('Imported "'+gname+'"')}catch(x){toast('That file is not a valid game')}};r.readAsText(f);e.target.value=''};
function starter(){clear();gname='My Game';$('#gn').value=gname;const S=(k,o)=>addObj(Object.assign({},KINDS[k],o));
 S('block',{n:'Baseplate',sx:80,sy:1,sz:80,y:-.5,x:0,z:0,c:'#4caf50'});S('kill',{n:'Lava',x:4,z:-6,y:.2,sx:36,sy:.4,sz:40});S('spawn',{x:0,z:30});
 [[0,16,2],[8,6,3.5],[-4,-6,5],[6,-18,6.5]].forEach((p,i)=>S('block',{n:'Step '+(i+1),x:p[0],z:p[1],y:p[2],sx:7,sy:1,sz:7,c:['#e8453c','#ffc928','#a24cf0','#ff8a2b'][i]}));
 S('coin',{x:8,z:6,y:6.5});S('goal',{x:6,z:-18,y:10});select(null)}
$('#tb').onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.add)return add(b.dataset.add);
 switch(b.dataset.a){case'dup':dup();break;case'del':del();break;case'play':startPlay();break;case'save':save();break;case'open':openDlg();break;case'exp':dl();break;case'imp':$('#fi').click();break;case'new':if(confirm('Start a new game? Unsaved changes will be lost.'))starter();break}};
// ---- viewport ----
function init(){R=new THREE.WebGLRenderer({canvas:$('#vp'),antialias:true});R.setPixelRatio(Math.min(devicePixelRatio,2));sc=new THREE.Scene();sc.background=new THREE.Color(0x9fd8ff);cam=new THREE.PerspectiveCamera(60,1,.1,1500);
 sc.add(new THREE.HemisphereLight(0xffffff,0x778899,.95));const sn=new THREE.DirectionalLight(0xffffff,.6);sn.position.set(30,60,20);sc.add(sn);
 hb=new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(1,1,1)),0xffff00);hb.visible=false;sc.add(hb);clock=new THREE.Clock();
 new ResizeObserver(resize).observe($('#vw'));resize();loop()}
function resize(){const v=$('#vw'),w=v.clientWidth,h=v.clientHeight;if(!w||!h)return;R.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
function loop(){requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta());
 if(mode==='edit'){cam.position.set(tg.x+Math.sin(yaw)*Math.cos(pitch)*dist,tg.y+Math.sin(pitch)*dist,tg.z+Math.cos(yaw)*Math.cos(pitch)*dist);cam.lookAt(tg)}else playTick(dt);
 R.render(sc,cam)}
function pan(dx,dy){const k=dist*.0016;tg.x+=(-Math.cos(yaw)*dx-Math.sin(yaw)*dy)*k;tg.z+=(Math.sin(yaw)*dx-Math.cos(yaw)*dy)*k}
const cv=$('#vp'),pts=new Map(),rc=new THREE.Raycaster();let moved=0,lastD=0,pyaw=0,ppitch=.35;
cv.onpointerdown=e=>{cv.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});moved=0;lastD=0};
cv.onpointermove=e=>{const p=pts.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(mode==='play'){pyaw-=dx*.006;ppitch=clamp(ppitch+dy*.005,-.2,1.2);return}
 moved+=Math.abs(dx)+Math.abs(dy);
 if(pts.size===1){if(e.buttons&2||e.shiftKey)pan(dx,dy);else{yaw-=dx*.006;pitch=clamp(pitch+dy*.005,.05,1.5)}}
 else if(pts.size===2){const a=Array.from(pts.values()),d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);if(lastD)dist=clamp(dist*lastD/d,5,250);lastD=d;pan(dx/2,dy/2)}};
cv.onpointerup=cv.onpointercancel=e=>{if(mode==='edit'&&pts.size===1&&moved<6&&e.type==='pointerup'){const r=cv.getBoundingClientRect();rc.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),cam);const h=rc.intersectObjects(Object.values(M));select(h.length?h[0].object.userData.id:null)}pts.delete(e.pointerId);lastD=0};
cv.onwheel=e=>{e.preventDefault();dist=clamp(dist*(1+e.deltaY*.001),5,250)};cv.oncontextmenu=e=>e.preventDefault();
// ---- play test ----
let pl=null,vy=0,on=false,cp=null,pcoins=0,ccount=0,ptime=0,won=false,jh=false;const mvJ={x:0,y:0},keys={};
function man(){const g=new THREE.Group(),L=k=>new THREE.MeshLambertMaterial({color:k});
 const b=(w,h,d,x,y,z,k,pv)=>{const gm=new THREE.BoxGeometry(w,h,d);if(pv)gm.translate(0,-h/2,0);const m=new THREE.Mesh(gm,L(k));m.position.set(x,y,z);g.add(m);return m};
 b(2,2,1,0,3,0,0x335fff);const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#ffd23c';x.fillRect(0,0,64,64);x.fillStyle='#111';x.strokeStyle='#111';x.lineWidth=4;x.beginPath();x.arc(22,26,4,0,7);x.arc(42,26,4,0,7);x.fill();x.beginPath();x.arc(32,38,12,.25,Math.PI-.25);x.stroke();
 const sk=L(0xffd23c),h=new THREE.Mesh(new THREE.BoxGeometry(1.3,1.3,1.3),[sk,sk,sk,sk,new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(c)}),sk]);h.position.y=4.65;g.add(h);
 g.a1=b(.95,2,.95,-1.5,4,0,0x335fff,1);g.a2=b(.95,2,.95,1.5,4,0,0x335fff,1);g.l1=b(.95,2,.95,-.5,2,0,0x2a8f4a,1);g.l2=b(.95,2,.95,.5,2,0,0x2a8f4a,1);return g}
function startPlay(){if(!objs.length)return toast('Add something first');if(pl)sc.remove(pl);mode='play';document.body.classList.add('playing');hb.visible=false;$('#win').classList.remove('on');
 const sp=objs.find(o=>o.role==='spawn'),s0=sp?{x:sp.x,y:sp.y+sp.sy/2,z:sp.z}:{x:0,y:2,z:0};
 pl=man();pl.position.set(s0.x,s0.y+1,s0.z);sc.add(pl);cp=s0;vy=0;on=false;pcoins=0;ptime=0;won=false;pyaw=0;ppitch=.35;
 ccount=objs.filter(o=>o.role==='coin').length;objs.forEach(o=>{o.got=false;M[o.id].visible=true})}
function stopPlay(){mode='edit';document.body.classList.remove('playing');if(pl){sc.remove(pl);pl=null}objs.forEach(o=>{M[o.id].visible=true;if(o.role==='coin')M[o.id].rotation.y=0});$('#win').classList.remove('on');hl()}
function respawn(){pl.position.set(cp.x,cp.y+1,cp.z);vy=0}
function win(){won=true;const w=$('#win');w.innerHTML='<div class="mb"><h2>You win!</h2><p>Coins: '+pcoins+' of '+ccount+'<br>Time: '+ptime.toFixed(1)+' s</p><div class="mbb"><button id="wr">Play again</button><button id="ws">Back to editor</button></div></div>';w.classList.add('on');$('#wr').onclick=startPlay;$('#ws').onclick=stopPlay}
function playTick(dt){const P=pl.position;
 if(!won){ptime+=dt;
  let ix=mvJ.x+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),iy=mvJ.y+(keys.w||keys.arrowup?1:0)-(keys.s||keys.arrowdown?1:0);const l=Math.hypot(ix,iy);if(l>1){ix/=l;iy/=l}
  const dx=-Math.sin(pyaw)*iy+Math.cos(pyaw)*ix,dz=-Math.cos(pyaw)*iy-Math.sin(pyaw)*ix;P.x+=dx*15*dt;P.z+=dz*15*dt;
  const sol=objs.filter(o=>o.role==='solid'||o.role==='spawn'||o.role==='check');
  for(const o of sol){const ox=Math.abs(P.x-o.x)-(o.sx/2+.8),oz=Math.abs(P.z-o.z)-(o.sz/2+.8),top=o.y+o.sy/2,bot=o.y-o.sy/2;if(ox<0&&oz<0&&P.y<top-.4&&P.y+5>bot){if(ox>oz)P.x+=(P.x>o.x?1:-1)*-ox;else P.z+=(P.z>o.z?1:-1)*-oz}}
  if((keys[' ']||jh)&&on){vy=24;on=false}
  const py=P.y;vy-=60*dt;P.y+=vy*dt;on=false;let best=null;
  for(const o of sol){const top=o.y+o.sy/2;if(Math.abs(P.x-o.x)<o.sx/2+.4&&Math.abs(P.z-o.z)<o.sz/2+.4&&top<=py+.4&&(best===null||top>best))best=top}
  if(best!==null&&P.y<=best&&vy<=0){P.y=best;vy=0;on=true}
  for(const o of objs){
   if(o.role==='kill'){if(Math.abs(P.x-o.x)<o.sx/2+1&&Math.abs(P.z-o.z)<o.sz/2+1&&P.y<o.y+o.sy/2+.3&&P.y+5>o.y-o.sy/2)respawn()}
   else if(o.role==='check'||o.role==='spawn'){if(on&&Math.abs(P.x-o.x)<o.sx/2&&Math.abs(P.z-o.z)<o.sz/2&&Math.abs(P.y-(o.y+o.sy/2))<.6)cp={x:o.x,y:o.y+o.sy/2,z:o.z}}
   else if(o.role==='coin'){if(!o.got){M[o.id].rotation.y+=dt*3;if(Math.hypot(P.x-o.x,P.y+2.5-o.y,P.z-o.z)<3.2){o.got=true;M[o.id].visible=false;pcoins++}}}
   else if(o.role==='goal'){if(Math.hypot(P.x-o.x,P.y+2.5-o.y,P.z-o.z)<o.sx/2+2.5)win()}}
  if(P.y<-60)respawn();
  if(l>.1)pl.rotation.y=Math.atan2(dx,dz);
  pl.t=(pl.t||0)+(l>.1?dt*10:0);const s=l>.1?Math.sin(pl.t)*.8:0;pl.l1.rotation.x=s;pl.l2.rotation.x=-s;pl.a1.rotation.x=-s;pl.a2.rotation.x=s;
  $('#ps').textContent='Coins '+pcoins+'/'+ccount+'   Time '+Math.floor(ptime)+' s'}
 const tx=P.x,ty=P.y+4,tz=P.z;cam.position.set(tx+Math.sin(pyaw)*Math.cos(ppitch)*20,ty+Math.sin(ppitch)*20+2,tz+Math.cos(pyaw)*Math.cos(ppitch)*20);cam.lookAt(tx,ty,tz)}
$('#stop').onclick=stopPlay;
addEventListener('keydown',e=>{if(mode==='play'){keys[e.key.toLowerCase()]=true;if(e.key===' ')e.preventDefault()}else if(e.key==='Delete'&&document.activeElement.tagName!=='INPUT')del()});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
const js=$('#js'),kn=$('#kn');let jid=null;
function jm(e){const r=js.getBoundingClientRect();let x=e.clientX-r.left-r.width/2,y=e.clientY-r.top-r.height/2;const l=Math.hypot(x,y),m=r.width/2*.7;if(l>m){x*=m/l;y*=m/l}mvJ.x=x/m;mvJ.y=-y/m;kn.style.transform='translate('+x+'px,'+y+'px)'}
js.onpointerdown=e=>{jid=e.pointerId;js.setPointerCapture(jid);jm(e)};js.onpointermove=e=>{if(e.pointerId===jid)jm(e)};
js.onpointerup=js.onpointercancel=()=>{jid=null;mvJ.x=mvJ.y=0;kn.style.transform=''};
const jb=$('#jb');jb.onpointerdown=()=>{jh=true};jb.onpointerup=jb.onpointercancel=jb.onpointerleave=()=>{jh=false};
init();starter();tree();props();
if('serviceWorker' in navigator){addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})})}
