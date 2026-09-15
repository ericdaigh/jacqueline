#!/bin/sh
# builds a local test copy that uses node_modules three.min.js and no web fonts
S=/tmp/claude-0/-home-claude/04ea3bac-81c8-5ebc-a094-c424bd8bbc68/scratchpad
python3 - "$S" <<'PY'
import sys;S=sys.argv[1];s=open('/home/claude/jacqueline/index.html').read()
t=s.replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/0.152.2/three.min.js','three.min.js').replace('<link rel="stylesheet" href="https://fonts.googleapis.com','<link rel="stylesheet" href="x://')
open(S+'/gtest.html','w').write('<!doctype html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width"></head><body>'+t+'</body></html>')
PY
