export function initLowPowerMode() {
  (function(){
    const KEY = 'guizang-ppt-low-power';
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stored = localStorage.getItem(KEY);
    window.__lowPowerMode = stored === '1' || (stored === null && reduced);
    function updateHint(){
      const hint = document.getElementById('hint');
      if(hint) hint.textContent = `← → 翻页 · B ${window.__lowPowerMode ? '动态' : '静态'} · ESC 索引`;
    }
    window.__setLowPowerMode = function(on, opts={}){
      window.__lowPowerMode = !!on;
      document.body.classList.toggle('low-power', window.__lowPowerMode);
      if(opts.persist !== false) localStorage.setItem(KEY, window.__lowPowerMode ? '1' : '0');
      if(window.__lowPowerMode && document.getAnimations) document.getAnimations().forEach(a=>a.cancel());
      updateHint();
      dispatchEvent(new CustomEvent('ppt-low-power-change', {detail:{on:window.__lowPowerMode}}));
      if(window.__playSlide) window.__playSlide(window.__currentSlideIndex || 0);
    };
    document.body.classList.toggle('low-power', window.__lowPowerMode);
    addEventListener('DOMContentLoaded', updateHint, {once:true});
  })();
}
