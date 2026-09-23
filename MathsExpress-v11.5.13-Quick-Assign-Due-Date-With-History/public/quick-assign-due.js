(function(root,factory){
  const api=factory();
  if(typeof module!=='undefined'&&module.exports) module.exports=api;
  root.MathExpressQuickAssignDue=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const pad=n=>String(n).padStart(2,'0');
  const dateValue=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  function addDays(now,days){const d=new Date(now);d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return d;}
  function presetDue(kind,now=new Date()){
    if(kind==='none') return {date:'',time:''};
    let target;
    if(kind==='today') target=addDays(now,0);
    else if(kind==='tomorrow') target=addDays(now,1);
    else if(kind==='friday'){
      const day=now.getDay();
      let delta=(5-day+7)%7;
      if(delta===0 && (now.getHours()>23 || (now.getHours()===23&&now.getMinutes()>=59))) delta=7;
      target=addDays(now,delta);
    } else target=addDays(now,7);
    return {date:dateValue(target),time:'23:59'};
  }
  function combineLocalDue(date,time){
    if(!date) return '';
    return `${date}T${time||'23:59'}`;
  }
  function previewText(date,time){
    if(!date) return 'No due date';
    const value=combineLocalDue(date,time);
    const d=new Date(value);
    if(Number.isNaN(d.getTime())) return 'Choose a due date';
    return `Due: ${d.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'short'})} at ${d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}`;
  }
  return {presetDue,combineLocalDue,previewText};
});
