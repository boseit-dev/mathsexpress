const test=require('node:test');
const assert=require('node:assert/strict');
const due=require('../public/quick-assign-due.js');

test('default due date is seven days away at 23:59',()=>{
  const now=new Date(2026,8,23,16,27,0,0);
  const value=due.presetDue('next-week',now);
  assert.equal(value.date,'2026-09-30');
  assert.equal(value.time,'23:59');
  assert.match(due.previewText(value.date,value.time),/^Due: /);
});

test('tomorrow preset and no due date are easy to select',()=>{
  const now=new Date(2026,8,23,16,27,0,0);
  assert.deepEqual(due.presetDue('tomorrow',now),{date:'2026-09-24',time:'23:59'});
  assert.deepEqual(due.presetDue('none',now),{date:'',time:''});
  assert.equal(due.combineLocalDue('',''),'');
});

test('friday preset chooses the next upcoming Friday',()=>{
  const wed=new Date(2026,8,23,16,27,0,0);
  assert.deepEqual(due.presetDue('friday',wed),{date:'2026-09-25',time:'23:59'});
});
