export function initDeck() {
const deck=document.getElementById('deck');
const slides=deck.querySelectorAll('.slide');
const nav=document.getElementById('nav');
let idx=0,total=slides.length,lock=false;
deck.style.width=(total*100)+'vw';

slides.forEach((s,i)=>{
  const b=document.createElement('button');
  b.className='dot';b.dataset.i=i;b.setAttribute('aria-label','Page '+(i+1));
  b.onclick=()=>go(i);nav.appendChild(b);
});

function go(n){
  if(lock)return;
  idx=Math.max(0,Math.min(total-1,n));
  window.__currentSlideIndex=idx;
  deck.style.transform=`translateX(${-idx*100}vw)`;
  nav.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
  const el=slides[idx];
  const th=el.dataset.theme||(el.classList.contains('light')?'light':(el.classList.contains('dark')?'dark':'dark'));
  document.body.classList.toggle('light-bg',th==='light');
  if(window.__playSlide)setTimeout(()=>window.__playSlide(idx),450);
  lock=true;setTimeout(()=>{lock=false;wheelAcc=0;},700);
}

let overviewOn=false;
const ov=document.createElement('div');
ov.id='overview';
ov.style.cssText='position:fixed;inset:0;z-index:100;background:rgba(var(--ink-rgb),.92);backdrop-filter:blur(12px);display:none;overflow-y:auto;padding:4vh 4vw';
document.body.appendChild(ov);

function buildOverview(){
  ov.innerHTML='';
  const grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:2vh 1.6vw;max-width:90vw;margin:0 auto';
  slides.forEach((s,i)=>{
    const card=document.createElement('div');
    card.style.cssText='cursor:pointer;border-radius:6px;overflow:hidden;border:2px solid '+(i===idx?'rgba(var(--paper-rgb),.8)':'rgba(var(--paper-rgb),.15)')+';transition:border-color .2s';
    card.onmouseenter=()=>card.style.borderColor='rgba(var(--paper-rgb),.6)';
    card.onmouseleave=()=>card.style.borderColor=i===idx?'rgba(var(--paper-rgb),.8)':'rgba(var(--paper-rgb),.15)';
    const wrap=document.createElement('div');
    wrap.style.cssText='width:100%;aspect-ratio:16/9;overflow:hidden;position:relative;pointer-events:none;background:'+(s.classList.contains('light')?'var(--paper)':'var(--ink)');
    const clone=s.cloneNode(true);
    clone.style.cssText='width:100vw;height:100vh;transform:scale('+(1/4.5)+');transform-origin:top left;position:absolute;top:0;left:0;pointer-events:none';
    wrap.appendChild(clone);
    const label=document.createElement('div');
    label.style.cssText='padding:6px 10px;font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--paper);opacity:.7';
    label.textContent=(i+1)+' / '+total;
    card.appendChild(wrap);card.appendChild(label);
    card.onclick=()=>{toggleOverview();go(i)};
    grid.appendChild(card);
  });
  ov.appendChild(grid);
}

function toggleOverview(){
  overviewOn=!overviewOn;
  if(overviewOn){buildOverview();ov.style.display='block';}
  else{ov.style.display='none';}
}

addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();toggleOverview();return;}
  if(e.key&&e.key.toLowerCase()==='b'&&!e.metaKey&&!e.ctrlKey&&!e.altKey){e.preventDefault();window.__setLowPowerMode(!window.__lowPowerMode);return;}
  if(overviewOn)return;
  if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '||e.key==='ArrowDown'){if(window.__pipeAdvance&&window.__pipeAdvance())return;go(idx+1);return;}
  if(e.key==='ArrowLeft'||e.key==='PageUp'||e.key==='ArrowUp')go(idx-1);
  if(e.key==='Home')go(0);if(e.key==='End')go(total-1);
});

let wheelTO=null,wheelAcc=0;
addEventListener('wheel',e=>{
  wheelAcc+=e.deltaY+e.deltaX;
  if(Math.abs(wheelAcc)>50){
    if(wheelAcc>0&&window.__pipeAdvance&&window.__pipeAdvance()){wheelAcc=0;}
    else{go(idx+(wheelAcc>0?1:-1));wheelAcc=0;}
  }
  clearTimeout(wheelTO);wheelTO=setTimeout(()=>wheelAcc=0,150);
},{passive:true});

let tx=0,ty=0;
addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
addEventListener('touchend',e=>{
  const dx=(e.changedTouches[0].clientX-tx);const dy=(e.changedTouches[0].clientY-ty);
  if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){if(dx<0&&window.__pipeAdvance&&window.__pipeAdvance())return;go(idx+(dx<0?1:-1));}
},{passive:true});

// 点击左半屏上翻，右半屏下翻
addEventListener('click',e=>{
  if(overviewOn)return;
  // 忽略导航点、概览按钮等 UI 元素上的点击
  if(e.target.closest('#nav,#overview-btn,#low-power-btn,a,button,input,select,textarea,[data-no-flip]'))return;
  if(e.clientX<innerWidth/2){go(idx-1);}else{if(window.__pipeAdvance&&window.__pipeAdvance())return;go(idx+1);}
});

go(0);
}
