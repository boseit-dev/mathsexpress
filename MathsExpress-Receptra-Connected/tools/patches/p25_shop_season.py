import sys
def patch(p,pairs):
    s=open(p,encoding='utf-8').read()
    for old,new,cnt in pairs:
        n=s.count(old)
        if n!=cnt: sys.exit(f'{p}: expected {cnt} got {n}: {old[:90]}')
        s=s.replace(old,new)
    open(p,'w',encoding='utf-8').write(s)
patch('deploy-core-1.js',[
("""  ...['Student Blue','Scholar Green',""","""  ...['Fraction Fixer','Graph Guardian','Angle Hunter','Pattern Seeker','Proof Builder','Calculus Captain','Statistics Star','Measurement Master'].map((name,i)=>({id:`title-${name.toLowerCase().replaceAll(' ','-')}`,category:'title',name,price:[250,350,450,550,800,1100,650,500][i],icon:'★',description:`Display the title “${name}” beside your name.`})),
  // Season rewards: earned by reaching a season rank, never sold in the shop.
  ...['Bronze','Silver','Gold','Platinum','Diamond','Champion'].map((rank)=>({id:`title-season-${rank.toLowerCase()}`,category:'title',name:`Season ${rank}`,price:0,seasonReward:true,icon:'★',description:`Earned by reaching ${rank} rank in a MathsExpress season.`})),
  ...['Student Blue','Scholar Green',""",1),
("""category:'avatar',name:`${name} Avatar`,price:90+i*65,icon:'●',""","""category:'avatar',name:`${name} Avatar`,price:90+i*65,icon:'●',color:['#3d6bd8','#2f9b62','#7a4fd1','#e07a2b','#1f9c9c','#d24545','#24345f','#c99a17','#7cc23a','#5b2fb0'][i],""",1),
])
patch('deploy-app.js',[
("""  const visible=shopCategory==='all'?COSMETICS:COSMETICS.filter(x=>x.category===shopCategory);""",
"""  const shopItems=COSMETICS.filter(x=>!x.seasonReward||state.ownedCosmetics.includes(x.id));
  const visible=shopCategory==='all'?shopItems:shopItems.filter(x=>x.category===shopCategory);""",1),
("""  if(item.category==='theme') return `<div class="mx-theme-thumb ${escapeHtml(item.id)}"><i></i><i></i><i></i><span>${escapeHtml(item.name.replace(' Theme',''))}</span></div>`;""",
"""  if(item.category==='theme') return `<div class="mx-theme-thumb ${escapeHtml(item.id)}"><i></i><i></i><i></i><span>${escapeHtml(item.name.replace(' Theme',''))}</span></div>`;
  if(item.category==='avatar') return `<div class="mx-avatar-thumb" style="--av:${escapeHtml(item.color||'#3d6bd8')}"><span>${escapeHtml(String(account.profile?.displayName||account.profile?.username||'M').trim().charAt(0).toUpperCase()||'M')}</span><small>${escapeHtml(item.name.replace(' Avatar',''))}</small></div>`;""",1),
("""<div class="shop-preview-stage">${cosmeticCharacterHtml({previewItem:item,showIdentity:true,spotlight:true})}</div>""",
"""<div class="shop-preview-stage">${item.category==='theme'||item.category==='avatar'?`<div class="shop-preview-swatch">${shopCosmeticThumbHtml(item)}</div>`:cosmeticCharacterHtml({previewItem:item,showIdentity:true,spotlight:true})}</div>""",1),
("""<article class="card shop-card locker-owned-item"><div class="item-icon">${item.icon}</div>""","""<article class="card shop-card locker-owned-item"><div class="item-icon locker-thumb">${shopCosmeticThumbHtml(item)}</div>""",1),
("""function v7Season(){
  const season=seasonDefinition(new Date()); const progress=state.v7SeasonProgress||{};
  openSimpleModal(season.name,`<h3>${escapeHtml(season.theme)} Season</h3><div class="simple-list">${season.quests.map(q=>`<div><strong>${escapeHtml(q.label)}</strong><span>${Math.min(q.target,Number(progress[q.id])||0)}/${q.target}</span></div>`).join('')}</div><p>Season progress is separate from school grades and resets each term.</p>`);
}""","""// Seasons are server-backed: 7-week windows, season XP from the reward ledger, class standings
// by accuracy and completed work, and a rank title for finishing a season.
async function v7Season(){
  openSimpleModal('Season','<div class="school-loading"><span class="spinner"></span><strong>Loading season…</strong></div>');
  try{
    const r=unwrapRpc(await accountClient.ensureClient().rpc('mathsexpress_my_season',{}));
    const ranks=Array.isArray(r.ranks)?r.ranks:[];
    const label=x=>String(x||'').replace(/^./,m=>m.toUpperCase());
    const xp=Number(r.season_xp)||0; const next=ranks.find(k=>xp<Number(k.xp));
    const prev=[...ranks].reverse().find(k=>xp>=Number(k.xp));
    const lo=Number(prev?.xp||0), hi=Number(next?.xp||lo||1);
    const pct=next?Math.round((xp-lo)/Math.max(1,hi-lo)*100):100;
    const daysLeft=Math.max(0,Math.ceil((Date.parse(r.ends_at)-Date.now())/86400000));
    const classes=Array.isArray(r.class_standings)?r.class_standings:[];
    openSimpleModal(`Season ${Number(r.season)||1}`,`<div class="season-panel"><div class="season-head"><div class="season-rank ${escapeHtml(r.rank)}">${escapeHtml(label(r.rank))}</div><div><strong>${xp.toLocaleString()} season XP</strong><small>${daysLeft} day${daysLeft===1?'':'s'} left · ends ${escapeHtml(new Date(r.ends_at).toLocaleDateString())}</small></div></div>
      <div class="season-bar"><i style="width:${pct}%"></i></div><p class="muted">${next?`${(hi-xp).toLocaleString()} XP to ${escapeHtml(label(next.id))}`:'Top rank reached!'} · Ranks: ${ranks.map(k=>`${escapeHtml(label(k.id))} ${Number(k.xp).toLocaleString()}`).join(' · ')}</p>
      <p class="muted">Season XP and rank reset when a new season starts. Achievements, coins and items are kept. Finishing a season at Bronze or above earns a Season title.</p>
      ${Number(r.season)>1&&!r.previous_season_claimed?'<button class="btn primary" data-action="claim-season-reward">Claim last season’s reward</button>':''}
      <h3>Class standings</h3><p class="muted">${escapeHtml(r.score_formula||'')}</p>
      <div class="simple-list season-classes">${classes.map((c,i)=>`<div class="${c.is_mine?'mine':''}"><strong>${i+1}. ${escapeHtml(c.name||'Class')}${c.is_mine?' (your class)':''}</strong><span>${Number(c.accuracy)}% accuracy · ${Number(c.completion)}% work done · <b>${Number(c.score)}</b></span></div>`).join('')||'<p>Join a class to see class standings.</p>'}</div></div>`);
  }catch(error){openSimpleModal('Season',`<p>${escapeHtml(error?.message||'Season data is unavailable right now.')}</p>`);}
}
function unwrapRpc(res){if(res?.error)throw res.error;return res?.data||{};}""",1),
("""  if (action === 'equip-item') {""","""  if (action === 'claim-season-reward') {
    accountClient.ensureClient().rpc('mathsexpress_claim_season_reward',{}).then(res=>{
      const r=unwrapRpc(res); const owned=new Set(state.ownedCosmetics||[]); if(r.item_id)owned.add(r.item_id);
      state=persist({...state,ownedCosmetics:[...owned]},{quiet:true});
      showToast(r.already_claimed?'Already claimed':'Season reward unlocked',`Season ${r.season}: ${String(r.rank||'').replace(/^./,m=>m.toUpperCase())} title`,'reward'); v7Season();
    }).catch(e=>showToast('Season reward',e?.message||'Not available'));
    return;
  }
  if (action === 'equip-item') {""",1),
])
print('ok')
