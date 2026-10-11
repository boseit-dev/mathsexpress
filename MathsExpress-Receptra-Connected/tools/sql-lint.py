#!/usr/bin/env python3
"""Parse-check SQL migrations, including every SQL and PL/pgSQL function body (pglast / libpg_query).
Usage: python tools/sql-lint.py file.sql [...]   (pip install pglast)"""
import sys, pglast
from pglast import ast
bad = 0
for path in sys.argv[1:]:
    src = open(path, encoding='utf-8').read()
    try:
        stmts = pglast.parse_sql(src)
    except pglast.parser.ParseError as e:
        print(f'{path}: top-level parse error: {e}'); bad += 1; continue
    for raw in stmts:
        st = raw.stmt
        if isinstance(st, (ast.CreateFunctionStmt, ast.DoStmt)):
            opts = st.options if isinstance(st, ast.CreateFunctionStmt) else st.args
            lang = 'plpgsql'; body = None
            for o in opts or ():
                if o.defname == 'language': lang = o.arg.sval
                if o.defname == 'as': body = o.arg[0].sval if isinstance(o.arg, tuple) else o.arg.sval
            name = '.'.join(n.sval for n in st.funcname) if isinstance(st, ast.CreateFunctionStmt) else 'DO block'
            try:
                if lang == 'sql': pglast.parse_sql(body)
                else:
                    sig = 'create function x() returns void language plpgsql as $b$' + body + '$b$;' if isinstance(st, ast.DoStmt) else src[raw.stmt_location:raw.stmt_location + raw.stmt_len]
                    pglast.parse_plpgsql(sig)
            except Exception as e:
                print(f'{path}: {name}: {e}'); bad += 1
print('OK' if not bad else f'{bad} problem(s)'); sys.exit(1 if bad else 0)
