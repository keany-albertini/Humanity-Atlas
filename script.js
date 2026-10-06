const bg=document.getElementById('sceneBg');
const canvas=document.getElementById('ambientCanvas');
const ctx=canvas.getContext('2d',{alpha:true});
const panel=document.getElementById('panel');
const panelKicker=document.getElementById('panelKicker');
const panelTitle=document.getElementById('panelTitle');
const panelLead=document.getElementById('panelLead');
const panelQuote=document.getElementById('panelQuote');
const panelFacts=document.getElementById('panelFacts');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const topics={
  water:{n:'01',title:'Eau',lead:"L'eau relie la santé, les sols, l'agriculture, les écosystèmes et l'habitat. La comprendre, c'est apprendre à la protéger avant même de chercher à l'exploiter.",quote:"Avant de chercher plus d'eau, comprendre où elle va.",facts:["Observer le cycle : pluie, infiltration, ruissellement, évaporation.","Protéger les sources et prévenir la pollution à la source.","Ralentir et infiltrer l'eau lorsque le contexte le permet."]},
  fire:{n:'02',title:'Feu',lead:"Le feu a transformé l'alimentation, les matériaux et les sociétés. Le connaître, c'est aussi comprendre les conditions qui permettent de le contrôler et les risques qu'il représente.",quote:"Maîtriser le feu, c'est surtout savoir quand ne pas l'utiliser.",facts:["La combustion dépend de la chaleur, du combustible et de l'oxygène.","Humidité, densité et forme modifient profondément la combustion.","Tout usage doit être adapté au lieu, au climat et aux règles locales."]},
  soil:{n:'03',title:'Sol',lead:"Le sol n'est pas un simple support : c'est un écosystème vivant fait de minéraux, d'eau, d'air, de racines, de champignons, de bactéries et d'animaux.",quote:"Une terre fertile n'est pas seulement nourrie : elle est vivante.",facts:["Garder un sol couvert limite l'érosion et les extrêmes thermiques.","La matière organique nourrit le vivant et améliore la structure.","Les racines, pores et organismes font circuler l'eau et l'air."]},
  nature:{n:'04',title:'Nature',lead:"Observer les saisons, le vent, l'eau, les plantes et les animaux permet de comprendre un milieu avant d'agir. Une connaissance juste commence souvent par une observation patiente.",quote:"Observer longtemps avant d'intervenir.",facts:["Croiser plusieurs indices plutôt que se fier à un seul signal.","Comparer les observations dans le temps et selon les saisons.","Prélever moins vite que ce que le milieu peut renouveler."]}
};

function openTopic(key){
  const t=topics[key]; if(!t)return;
  panelKicker.textContent='Racine · '+t.n;
  panelTitle.textContent=t.title;
  panelLead.textContent=t.lead;
  panelQuote.textContent=t.quote;
  panelFacts.innerHTML=t.facts.map((f,i)=>'<div class="fact"><b>0'+(i+1)+'</b><span>'+f+'</span></div>').join('');
  panel.classList.add('open');
  panel.setAttribute('aria-hidden','false');
}
function closePanel(){panel.classList.remove('open');panel.setAttribute('aria-hidden','true')}
document.querySelectorAll('[data-topic]').forEach(el=>el.addEventListener('click',()=>openTopic(el.dataset.topic)));
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closePanel));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel()});

document.getElementById('exploreBtn').addEventListener('click',()=>openTopic('water'));
document.getElementById('enterTop').addEventListener('click',()=>openTopic('nature'));
document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click',()=>{
  if(b.dataset.jump==='roots'||b.dataset.jump==='knowledge') openTopic('water');
  if(b.dataset.jump==='vision') openTopic('nature');
}));

let targetX=0,targetY=0,currentX=0,currentY=0;
function pointerMove(x,y){
  targetX=(x/innerWidth-.5)*2;
  targetY=(y/innerHeight-.5)*2;
}
if(!reduced){
  addEventListener('pointermove',e=>pointerMove(e.clientX,e.clientY),{passive:true});
  addEventListener('touchmove',e=>{const t=e.touches[0];if(t)pointerMove(t.clientX,t.clientY)},{passive:true});
}
function animateParallax(){
  if(!reduced){
    currentX+=(targetX-currentX)*.035;
    currentY+=(targetY-currentY)*.035;
    const x=currentX*-14, y=currentY*-9;
    bg.style.transform='scale(1.065) translate3d('+x+'px,'+y+'px,0)';
  }
  requestAnimationFrame(animateParallax)
}
animateParallax();

let W=0,H=0,dpr=1,fireflies=[],petals=[];
function rnd(a,b){return a+Math.random()*(b-a)}
function resetCanvas(){
  dpr=Math.min(devicePixelRatio||1,1.6);W=innerWidth;H=innerHeight;
  canvas.width=W*dpr;canvas.height=H*dpr;canvas.style.width=W+'px';canvas.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const fc=Math.max(18,Math.min(48,Math.floor(W/34)));
  const pc=Math.max(24,Math.min(62,Math.floor(W/27)));
  fireflies=Array.from({length:fc},()=>({x:rnd(W*.38,W*.95),y:rnd(H*.13,H*.78),r:rnd(.7,1.8),vx:rnd(-.09,.09),vy:rnd(-.055,.055),p:rnd(0,6.28),a:rnd(.15,.72)}));
  petals=Array.from({length:pc},()=>makePetal(true));
}
function makePetal(randomY=false){return{x:rnd(-40,W+40),y:randomY?rnd(-H*.2,H):rnd(-100,-15),s:rnd(2.2,6),vy:rnd(.18,.62),vx:rnd(-.16,.18),rot:rnd(0,6.28),vr:rnd(-.012,.012),phase:rnd(0,6.28),a:rnd(.2,.72)}}
function drawAmbient(t){
  ctx.clearRect(0,0,W,H);
  fireflies.forEach(f=>{
    f.p+=.008;f.x+=f.vx+Math.sin(f.p)*.035;f.y+=f.vy+Math.cos(f.p*.8)*.025;
    if(f.x<0)f.x=W;if(f.x>W)f.x=0;if(f.y<0)f.y=H;if(f.y>H)f.y=0;
    const pulse=.52+.48*Math.sin(t*.0018+f.p*2);
    const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.r*8);
    g.addColorStop(0,'rgba(255,232,156,'+(f.a*pulse)+')');g.addColorStop(.18,'rgba(246,211,121,'+(f.a*.55*pulse)+')');g.addColorStop(1,'rgba(255,210,120,0)');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(f.x,f.y,f.r*8,0,Math.PI*2);ctx.fill();
  });
  petals.forEach((p,i)=>{
    p.y+=p.vy;p.x+=p.vx+Math.sin(t*.00065+p.phase)*.24;p.rot+=p.vr;
    if(p.y>H+30||p.x<-60||p.x>W+60)petals[i]=makePetal(false);
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=p.a;
    ctx.fillStyle='rgba(238,158,184,.9)';ctx.beginPath();ctx.ellipse(0,0,p.s,p.s*.48,.25,0,Math.PI*2);ctx.fill();ctx.restore();
  });
  requestAnimationFrame(drawAmbient)
}
resetCanvas();addEventListener('resize',resetCanvas);requestAnimationFrame(drawAmbient);

document.getElementById('menuToggle').addEventListener('click',()=>openTopic('nature'));
document.getElementById('soundButton').addEventListener('click',e=>{
  e.currentTarget.textContent=e.currentTarget.textContent==='♪'?'♩':'♪';
});