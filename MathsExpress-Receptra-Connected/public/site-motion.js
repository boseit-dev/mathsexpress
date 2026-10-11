(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('mx-in-view');observer.unobserve(entry.target);}}),{threshold:0.08});
  document.querySelectorAll('main > section').forEach((section,i)=>{section.classList.add('mx-reveal');section.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*75}ms`);observer.observe(section);});
  let queued=false;
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--page-progress',`${max>0?Math.min(100,scrollY/max*100):0}%`);queued=false;};
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});update();
})();
