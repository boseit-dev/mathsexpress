import sys
p='deploy-app.js';s=open(p,encoding='utf-8').read()
i=s.find('function renderTools() {');j=s.find('\nfunction',i+10);body=s[i:j]
for t in ['study','assessment','live','school','access','complete']:
    old="${activeToolTab==='%s'?"%t
    assert body.count(old)==1,t
    body=body.replace(old,"${toolTabShown('%s')?"%t)
old="  if (!tabs.some(([id])=>id===activeToolTab)) activeToolTab='study';\n"
assert body.count(old)==1
body=body.replace(old,old+"  const searching=Boolean(toolSearchQuery.trim());\n  const toolTabShown=(id)=>searching?tabs.some(([t])=>t===id):activeToolTab===id;\n")
old='''<div class="ultimate-tabs">${tabs.map(([id,label])=>`<button class="${activeToolTab===id?'active':''}"'''
assert body.count(old)==1
body=body.replace(old,'''<div class="tool-search"><input id="tool-search-input" type="search" placeholder="Search all tools – e.g. calculator, poll, timer" value="${escapeHtml(toolSearchQuery)}" aria-label="Search tools" autocomplete="off"></div><p class="tool-search-empty" id="tool-search-empty" hidden>No tools match “<span></span>”.</p>
    <div class="ultimate-tabs" ${searching?'hidden':''}>${tabs.map(([id,label])=>`<button class="${activeToolTab===id?'active':''}"''')
assert body.endswith('  </div>`;\n}\n')
body=body[:-len('}\n')]+'  applyToolSearchFilter();\n}\n'
s=s[:i]+'''let toolSearchQuery='';
function applyToolSearchFilter(){
  const view=document.getElementById('app-view'); if(!view)return;
  const q=toolSearchQuery.trim().toLowerCase();
  const items=[...view.querySelectorAll('.ultimate-section .ultimate-card,.ultimate-section .access-toggle')];
  let shown=0;
  for(const el of items){ const hit=!q||el.textContent.toLowerCase().includes(q); el.hidden=!hit; if(hit)shown++; }
  view.querySelectorAll('.ultimate-section').forEach(sec=>{ if(!q){sec.hidden=false;return;} sec.hidden=!sec.querySelector('.ultimate-card:not([hidden]),.access-toggle:not([hidden])'); });
  view.querySelectorAll('.ultimate-section .section-heading,.ultimate-section .mastery-map-grid').forEach(el=>{el.hidden=Boolean(q);});
  const empty=document.getElementById('tool-search-empty'); if(empty){empty.hidden=!q||shown>0; const sp=empty.querySelector('span'); if(sp)sp.textContent=toolSearchQuery.trim();}
}
'''+body+s[j:]
old="  document.addEventListener('fullscreenchange',handleAssignmentFullscreenChange);"
assert s.count(old)==1
s=s.replace(old,'''  document.addEventListener('input',(event)=>{
    if(event.target?.id!=='tool-search-input')return;
    const had=Boolean(toolSearchQuery.trim()); toolSearchQuery=String(event.target.value||'').slice(0,80);
    if(had!==Boolean(toolSearchQuery.trim())){ renderTools(); const box=document.getElementById('tool-search-input'); if(box){box.focus(); box.setSelectionRange(box.value.length,box.value.length);} }
    else applyToolSearchFilter();
  });
'''+old)
open(p,'w',encoding='utf-8').write(s)
print('ok')
