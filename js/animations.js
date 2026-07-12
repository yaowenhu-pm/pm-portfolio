export async function initAnimations() {
let motion;
try {
  motion = await import('../assets/motion.min.js');
} catch(e1) {
  try {
    motion = await import('https://cdn.jsdelivr.net/npm/motion@11.11.17/+esm');
  } catch(e2) {
    console.warn('[motion] both failed, disabling animations');
    document.querySelectorAll('[data-anim]').forEach(el=>{el.style.opacity='1';el.style.transform='none'});
    document.querySelectorAll('[data-animate="pipeline"] [data-anim]').forEach(el=>el.style.opacity='1');
  }
}

if(motion){
  const {animate,stagger}=motion;
  document.body.classList.add('motion-ready');
  const EASE=[.22,1,.36,1];
  const slides=[...document.querySelectorAll('.slide')];
  let pipeStep=-1,lastIdx=-1;

  function resetAnims(slide){slide.querySelectorAll('[data-anim]').forEach(el=>{el.style.opacity='';el.style.transform=''})}
  function revealStatic(slide){resetAnims(slide);document.getAnimations?.().forEach(a=>a.cancel());slide.querySelectorAll('[data-anim]').forEach(el=>{el.style.opacity='1';el.style.transform='none'})}

  function playSlide(i){
    const slide=slides[i];if(!slide)return;
    lastIdx=i;
    const recipe=slide.dataset.animate||(slide.classList.contains('hero')?'hero':'cascade');
    if(window.__lowPowerMode){revealStatic(slide);return;}
    if(recipe==='pipeline'){
      pipeStep=-1;
      slide.querySelectorAll('[data-anim]').forEach(el=>{el.style.opacity='0.15';el.style.transform='none'});
      return;
    }
    resetAnims(slide);
    const all=[...slide.querySelectorAll('[data-anim]')];
    if(!all.length)return;
    if(recipe==='directional'){
      const lefts=all.filter(el=>el.dataset.anim==='left');
      const divs=all.filter(el=>el.dataset.anim==='divider');
      const rights=all.filter(el=>el.dataset.anim==='right');
      const others=all.filter(el=>!['left','right','divider'].includes(el.dataset.anim));
      if(others.length)animate(others,{opacity:[0,1],y:[12,0]},{duration:.6,delay:stagger(.1,{start:.15}),easing:EASE});
      if(lefts.length)animate(lefts,{opacity:[0,1],x:[-24,0]},{duration:.8,delay:.35,easing:EASE});
      if(divs.length)animate(divs,{opacity:[0,.25]},{duration:.5,delay:.9});
      if(rights.length)animate(rights,{opacity:[0,1],x:[24,0]},{duration:.8,delay:1.0,easing:EASE});
      return;
    }
    if(recipe==='quote'){
      const lines=all.filter(el=>el.dataset.anim==='line');
      const others=all.filter(el=>el.dataset.anim!=='line');
      if(others.length)animate(others,{opacity:[0,1],y:[8,0]},{duration:.6,delay:stagger(.12,{start:.2}),easing:EASE});
      if(lines.length)animate(lines,{opacity:[.35,1],y:[10,0]},{duration:.8,delay:stagger(.55,{start:.5}),easing:EASE});
      return;
    }
    if(recipe==='hero'){animate(all,{opacity:[0,1],y:[14,0]},{duration:.9,delay:stagger(.16,{start:.2}),easing:EASE});return;}
    animate(all,{opacity:[0,1],y:[16,0]},{duration:.75,delay:stagger(.1,{start:.15}),easing:EASE});
  }

  function pipeAdvance(){
    if(window.__lowPowerMode)return false;
    const slide=slides[lastIdx];
    if(!slide||slide.dataset.animate!=='pipeline')return false;
    const steps=[...slide.querySelectorAll('[data-anim="step"]')];
    const arrows=[...slide.querySelectorAll('[data-anim="arrow"]')];
    if(pipeStep>=steps.length-1)return false;
    pipeStep++;
    animate(steps[pipeStep],{opacity:[0.15,1],y:[8,0]},{duration:.5,easing:EASE});
    if(pipeStep>0&&arrows[pipeStep-1])animate(arrows[pipeStep-1],{opacity:[0.15,.7]},{duration:.3,delay:.15});
    return true;
  }

  window.__playSlide=playSlide;
  window.__pipeAdvance=pipeAdvance;
  playSlide(0);
}
}
