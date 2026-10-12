// Every data-action used in the app must have a handler. Dead buttons were a recurring complaint.
const test=require('node:test');const assert=require('node:assert');const fs=require('node:fs');const path=require('node:path');
const files=['public/deploy-app.js','public/deploy-core-1.js','public/deploy-core-2.js','public/v7-features.js','public/app.html','public/quick-assign-due.js'];
const all=files.map(f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8')).join('\n');
test('every data-action button has a handler',()=>{
  const used=new Set([...all.matchAll(/data-action="([a-z0-9-]+)"/g)].map(m=>m[1]));
  const handled=new Set([
    ...[...all.matchAll(/action\s*===?\s*['"]([a-z0-9-]+)['"]/g)].map(m=>m[1]),
    ...[...all.matchAll(/case\s+['"]([a-z0-9-]+)['"]/g)].map(m=>m[1]),
    ...[...all.matchAll(/['"]([a-z0-9-]+)['"]\s*:\s*[\[(a-zA-Z]/g)].map(m=>m[1]),
    ...[...all.matchAll(/ownerActionButton\('([a-z0-9-]+)'/g)].map(m=>m[1]),
    ...[...all.matchAll(/\[data-action="([a-z0-9-]+)"\]/g)].map(m=>m[1]),
    ...[...all.matchAll(/\[['"]([a-z0-9-]+)['"]\s*,\s*['"][^'"]*['"]\]/g)].map(m=>m[1]),
  ]);
  for(const arr of all.matchAll(/\[((?:'[a-z0-9-]+',?\s*){2,})\]\.includes\(action\)/g)) for(const m of arr[1].matchAll(/'([a-z0-9-]+)'/g)) handled.add(m[1]);
  const missing=[...used].filter(a=>!handled.has(a)&&!a.startsWith('v7-'));
  assert.deepEqual(missing,[],`buttons with no handler: ${missing.join(', ')}`);
});
