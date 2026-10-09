'use strict';
(function(root){
  const FUNCS = new Set(['sqrt','abs','sin','cos','tan','log','ln']);
  const CONSTS = { pi: Math.PI, e: Math.E };
  const OPS = {
    '+': {p:1,a:'L',n:2,f:(a,b)=>a+b},
    '-': {p:1,a:'L',n:2,f:(a,b)=>a-b},
    '*': {p:2,a:'L',n:2,f:(a,b)=>a*b},
    '/': {p:2,a:'L',n:2,f:(a,b)=>a/b},
    '^': {p:4,a:'R',n:2,f:(a,b)=>Math.pow(a,b)},
    'u+':{p:3,a:'R',n:1,f:(a)=>a},
    'u-':{p:3,a:'R',n:1,f:(a)=>-a}
  };

  function normalise(input=''){
    return String(input)
      .replace(/[×·]/g,'*')
      .replace(/÷/g,'/')
      .replace(/[−–—]/g,'-')
      .replace(/π/gi,'pi')
      .replace(/√\s*\(/g,'sqrt(')
      .replace(/\*\*/g,'^')
      .trim();
  }

  function rawTokens(input){
    const s=normalise(input);
    if(!s || s.length>500) throw new Error('Expression is empty or too long.');
    const out=[]; let i=0;
    while(i<s.length){
      const ch=s[i];
      if(/\s/.test(ch)){ i++; continue; }
      if(/[0-9.]/.test(ch)){
        const m=s.slice(i).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:e[+\-]?\d+)?/i);
        if(!m) throw new Error('Invalid number.');
        const n=Number(m[0]); if(!Number.isFinite(n)) throw new Error('Invalid number.');
        out.push({t:'num',v:n}); i+=m[0].length; continue;
      }
      if(/[A-Za-z_]/.test(ch)){
        const m=s.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/); const id=m[0].toLowerCase();
        out.push({t:'id',v:id}); i+=m[0].length; continue;
      }
      if('+-*/^(),'.includes(ch)){ out.push({t:ch,v:ch}); i++; continue; }
      throw new Error('Unsupported character in expression.');
    }
    return out;
  }

  function isValueEnd(tok){ return tok && (tok.t==='num'||tok.t==='id'||tok.t===')'); }
  function isValueStart(tok){ return tok && (tok.t==='num'||tok.t==='id'||tok.t==='('); }
  function withImplicitMultiplication(tokens){
    const out=[];
    for(let i=0;i<tokens.length;i++){
      const cur=tokens[i], prev=out[out.length-1];
      if(prev && isValueEnd(prev) && isValueStart(cur)){
        const prevIsFunction = prev.t==='id' && FUNCS.has(prev.v) && cur.t==='(';
        if(!prevIsFunction) out.push({t:'*',v:'*'});
      }
      out.push(cur);
    }
    return out;
  }

  function toRpn(input){
    const tokens=withImplicitMultiplication(rawTokens(input));
    const output=[], stack=[]; let prev=null;
    for(let i=0;i<tokens.length;i++){
      const tok=tokens[i], next=tokens[i+1];
      if(tok.t==='num'){ output.push(tok); prev=tok; continue; }
      if(tok.t==='id'){
        if(FUNCS.has(tok.v) && next?.t==='(') stack.push({t:'func',v:tok.v});
        else output.push(tok);
        prev=tok; continue;
      }
      if(tok.t===','){
        while(stack.length && stack[stack.length-1].t!=='(') output.push(stack.pop());
        if(!stack.length) throw new Error('Misplaced comma.');
        prev=tok; continue;
      }
      if(tok.t==='('){ stack.push(tok); prev=tok; continue; }
      if(tok.t===')'){
        while(stack.length && stack[stack.length-1].t!=='(') output.push(stack.pop());
        if(!stack.length) throw new Error('Mismatched brackets.');
        stack.pop();
        if(stack.length && stack[stack.length-1].t==='func') output.push(stack.pop());
        prev=tok; continue;
      }
      if('+-*/^'.includes(tok.t)){
        let op=tok.t;
        if((op==='+'||op==='-') && (!prev || ['+','-','*','/','^','(',','].includes(prev.t))) op='u'+op;
        const spec=OPS[op];
        while(stack.length && stack[stack.length-1].t==='op'){
          const top=OPS[stack[stack.length-1].v];
          if((spec.a==='L' && spec.p<=top.p)||(spec.a==='R' && spec.p<top.p)) output.push(stack.pop()); else break;
        }
        stack.push({t:'op',v:op}); prev=tok; continue;
      }
      throw new Error('Unsupported token.');
    }
    while(stack.length){ const x=stack.pop(); if(x.t==='('||x.t===')') throw new Error('Mismatched brackets.'); output.push(x); }
    return output;
  }

  function evaluate(input, vars={}, options={}){
    const rpn=toRpn(input), stack=[];
    const angleMode=String(options.angleMode||'rad').toLowerCase();
    const angle=x=>angleMode==='deg'?x*Math.PI/180:x;
    const funcs={sqrt:Math.sqrt,abs:Math.abs,sin:x=>Math.sin(angle(x)),cos:x=>Math.cos(angle(x)),tan:x=>Math.tan(angle(x)),log:Math.log10,ln:Math.log};
    for(const tok of rpn){
      if(tok.t==='num'){stack.push(tok.v);continue;}
      if(tok.t==='id'){
        if(Object.prototype.hasOwnProperty.call(CONSTS,tok.v)){stack.push(CONSTS[tok.v]);continue;}
        if(!Object.prototype.hasOwnProperty.call(vars,tok.v)) throw new Error(`Unknown value: ${tok.v}`);
        const n=Number(vars[tok.v]); if(!Number.isFinite(n)) throw new Error(`Invalid value: ${tok.v}`); stack.push(n); continue;
      }
      if(tok.t==='func'){
        if(stack.length<1) throw new Error('Missing function value.'); const a=stack.pop(); const v=funcs[tok.v](a); if(!Number.isFinite(v)) throw new Error('Calculation is not finite.'); stack.push(v); continue;
      }
      if(tok.t==='op'){
        const spec=OPS[tok.v]; if(stack.length<spec.n) throw new Error('Incomplete expression.');
        let v; if(spec.n===1){v=spec.f(stack.pop());} else {const b=stack.pop(),a=stack.pop();v=spec.f(a,b);} if(!Number.isFinite(v)) throw new Error('Calculation is not finite.'); stack.push(v); continue;
      }
    }
    if(stack.length!==1||!Number.isFinite(stack[0])) throw new Error('Invalid expression.');
    return stack[0];
  }

  function compile(input, options={}){
    const expression=String(input||'');
    // Validate now so invalid expressions fail before plotting.
    const rpn=toRpn(expression);
    return function(vars={}){
      // Re-evaluate from the original expression. Expressions are tiny and this avoids code generation/eval.
      return evaluate(expression,vars,options);
    };
  }

  root.MXSafeMath=Object.freeze({normalise,evaluate,compile});
})(globalThis);
