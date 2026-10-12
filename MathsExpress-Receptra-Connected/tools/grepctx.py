# Usage: python3 tools/grepctx.py REGEX [context_chars] [files...]  (prints matches with context; bundles have very long lines)
import sys,re
pat=re.compile(sys.argv[1]); w=int(sys.argv[2]) if len(sys.argv)>2 else 80
base='public/'
files=sys.argv[3:] or [base+f for f in ['deploy-app.js','deploy-core-1.js','deploy-core-2.js','app.html','v7-features.js']]
for f in files:
  s=open(f,encoding='utf-8').read()
  for m in pat.finditer(s):
    print(f"{f}:{s.count(chr(10),0,m.start())+1}:{m.start()}: ...{s[max(0,m.start()-w):m.end()+w]!r}")
