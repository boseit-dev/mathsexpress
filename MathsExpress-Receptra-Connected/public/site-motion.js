(() => {
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce || !('IntersectionObserver' in window))return;
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('mx-in-view');observer.unobserve(entry.target);}}),{threshold:0.08});
  document.querySelectorAll('main > section').forEach((section,i)=>{section.classList.add('mx-reveal');section.style.setProperty('--reveal-delay',`${Math.min(i%3,2)*75}ms`);observer.observe(section);});
  let queued=false;
  const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--page-progress',`${max>0?Math.min(100,scrollY/max*100):0}%`);queued=false;};
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});update();
})();

// School-visit slides (v11.5.25)
(function(){
  const root=document.querySelector('.visit-slides'); if(!root)return;
  const track=root.querySelector('.visit-track'); const slides=[...root.querySelectorAll('.visit-slide')];
  const dots=root.querySelector('.visit-dots'); let index=0, timer=null;
  dots.innerHTML=slides.map((_,i)=>`<i data-dot="${i}"></i>`).join('');
  function show(i){ index=(i+slides.length)%slides.length; track.style.transform=`translateX(-${index*100}%)`;
    dots.querySelectorAll('i').forEach((d,j)=>d.classList.toggle('on',j===index));
    slides.forEach((s,j)=>s.setAttribute('aria-hidden',String(j!==index))); }
  function auto(){ clearInterval(timer); if(!matchMedia('(prefers-reduced-motion: reduce)').matches) timer=setInterval(()=>show(index+1),6000); }
  root.addEventListener('click',e=>{ const b=e.target.closest('[data-visit]'); const d=e.target.closest('[data-dot]');
    if(b){show(index+Number(b.dataset.visit));auto();} else if(d){show(Number(d.dataset.dot));auto();} });
  show(0); auto();
})();
