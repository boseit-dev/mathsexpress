#!/usr/bin/env python3
"""Regenerate the dark-mode / high-contrast safety net at the end of public/styles.css.

Most of styles.css hardcodes a light palette. The hand-written html.mx-dark rules only
cover some of it, so in dark mode many elements kept dark text on a now-dark surface
("black text on black"). This script reads every top-level rule, and for the ones that
hardcode a light neutral background, a dark text colour or a light border, emits a
dark equivalent under :where(html.mx-dark, html.mx-theme-dark). :where() keeps the
generated rules below the specificity of the hand-tuned html.mx-dark rules, so those
still win. It also mirrors hand-tuned rules between the two dark classes
(accessibility dark mode = mx-dark, dark theme preset = mx-theme-dark), which had
drifted apart.

Usage: python3 -I tools/gen-dark-overrides.py public/styles.css
"""
import re, sys, colorsys

START = '/* >>> generated: dark-mode safety net (tools/gen-dark-overrides.py) */'
END = '/* <<< generated: dark-mode safety net */'
NAMED = {'white': (255, 255, 255), 'black': (0, 0, 0)}
COLOR_RE = re.compile(r'#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b(?:white|black)\b')

def parse(tok):
    tok = tok.strip().lower()
    if tok in NAMED: return (*NAMED[tok], 1.0)
    if tok.startswith('#'):
        h = tok[1:]
        if len(h) in (3, 4): h = ''.join(c * 2 for c in h)
        if len(h) not in (6, 8): return None
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
    m = re.match(r'rgba?\(([^)]*)\)', tok)
    if m:
        parts = [p for p in re.split(r'[\s,/]+', m.group(1)) if p]
        try:
            r, g, b = (float(x) for x in parts[:3])
            a = float(parts[3].rstrip('%')) / (100 if parts[3].endswith('%') else 1) if len(parts) > 3 else 1.0
            return (r, g, b, a)
        except ValueError: return None
    return None

def lum(c):
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])

def chroma(c): return max(c[:3]) - min(c[:3])

def light_surface(c): return c[3] >= 0.5 and lum(c) >= 0.72 and chroma(c) <= 40
def light_border(c): return c[3] >= 0.3 and lum(c) >= 0.55 and chroma(c) <= 45
def dark_text(c): return c[3] >= 0.5 and lum(c) < 0.18

def dark_text_replacement(c):
    if chroma(c) <= 40:
        return '#eef0f6' if lum(c) < 0.05 else '#c8ccd8'
    h, l, s = colorsys.rgb_to_hls(*(v / 255 for v in c[:3]))
    r, g, b = colorsys.hls_to_rgb(h, 0.76, min(1, s))
    return '#%02x%02x%02x' % (round(r * 255), round(g * 255), round(b * 255))

def top_level_rules(css):
    """Yield (selector, body) for rules at depth 0; @-blocks are skipped whole."""
    i, n = 0, len(css)
    while i < n:
        if css.startswith('/*', i):
            j = css.find('*/', i + 2); i = n if j < 0 else j + 2; continue
        if css[i].isspace(): i += 1; continue
        brace = css.find('{', i)
        if brace < 0: break
        head = css[i:brace].strip()
        depth, j = 1, brace + 1
        while j < n and depth:
            if css.startswith('/*', j):
                k = css.find('*/', j + 2); j = n if k < 0 else k + 2; continue
            if css[j] == '{': depth += 1
            elif css[j] == '}': depth -= 1
            j += 1
        if not head.startswith('@'): yield head, css[brace + 1:j - 1]
        i = j

def decls(body):
    for part in body.split(';'):
        if ':' in part:
            k, v = part.split(':', 1)
            yield k.strip().lower(), v.strip()

SKIP_SEL = re.compile(r'mx-high-contrast|mx-loading|::selection|:root|^html\b(?!\.mx)|^body\b|maintenance-icon')

def main(path):
    css = open(path, encoding='utf-8').read()
    if START in css:
        css = css[:css.index(START)].rstrip() + '\n'
    out, mirrored, grouped = [], [], {}
    for sel, body in top_level_rules(css):
        if 'mx-dark' in sel or 'mx-theme-dark' in sel:
            if 'mx-dark' in sel and 'mx-theme-dark' not in sel:
                mirrored.append(f"{sel.replace('html.mx-dark', 'html.mx-theme-dark')}{{{body}}}")
            elif 'mx-theme-dark' in sel and 'html.mx-dark' not in sel:
                mirrored.append(f"{sel.replace('html.mx-theme-dark', 'html.mx-dark')}{{{body}}}")
            continue
        if SKIP_SEL.search(sel): continue
        new = []
        for k, v in decls(body):
            colors = [parse(t) for t in COLOR_RE.findall(v)]
            colors = [c for c in colors if c]
            if not colors: continue
            if k in ('background', 'background-color', 'background-image'):
                if 'url(' in v: continue
                if all(light_surface(c) for c in colors):
                    shade = '#1b1e27' if min(lum(c) for c in colors) >= 0.9 else '#252935'
                    new.append(f'background:{shade}!important')
            elif k == 'color':
                c = colors[0]
                if dark_text(c): new.append(f'color:{dark_text_replacement(c)}!important')
            elif k in ('border', 'border-color', 'border-top', 'border-bottom', 'border-left', 'border-right', 'outline'):
                if all(light_border(c) for c in colors):
                    side = '' if k in ('border', 'border-color', 'outline') else k[len('border'):]
                    prop = 'outline-color' if k == 'outline' else f'border{side}-color'
                    new.append(f'{prop}:#3a3f4e!important')
        if new:
            key = ';'.join(dict.fromkeys(new))
            grouped.setdefault(key, []).extend(s.strip() for s in sel.split(','))
    for key, sels in grouped.items():
        # Grouped by declaration set to keep the block small. A plain selector list (not :is()) so every
        # selector keeps its own specificity; :is() would take the highest one in the group.
        out.append(f"{','.join(f':where(.mx-dark,.mx-theme-dark) {x}' for x in dict.fromkeys(sels))}{{{key}}}")
    block = '\n'.join([START, *mirrored, *out, END])
    open(path, 'w', encoding='utf-8').write(css + '\n' + block + '\n')
    print(f'{len(out)} generated rules, {len(mirrored)} mirrored rules')

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else 'public/styles.css')
