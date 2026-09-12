"""Verify generated artifacts and preservation of the original published run."""
import json, subprocess, re
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
catalog=json.loads((ROOT/'src/catalog.json').read_text())
assert len(catalog['concepts'])==13
original=subprocess.check_output(['git','show','6938b6c:index.html'],cwd=ROOT)
assert (ROOT/'archives/claude-original.html').read_bytes()==original, 'Original ten were modified'
paths=[ROOT/'assets/catalog.mjs', *sorted((ROOT/'previews').glob('*.html'))]
before={p:p.read_bytes() for p in paths}
subprocess.run(['python3','src/build_archive.py'],cwd=ROOT,check=True)
assert all(p.read_bytes()==v for p,v in before.items()),'Build is not reproducible'
for c in catalog['concepts']:
 page=(ROOT/'previews'/f"{c['id']}.html").read_text()
 assert 'pill-ready' in page and 'pill-state' in page
 assert 'Content-Security-Policy' in page
 assert '/Users/winson' not in page
 for script in re.findall(r'<script(?:\s[^>]*)?>(.*?)</script>',page,re.S):
  subprocess.run(['node','--check','--input-type=commonjs'],input=script,text=True,check=True,capture_output=True)
for script in ['assets/app.mjs','assets/core.mjs','assets/catalog.mjs']:
 subprocess.run(['node','--check',script],cwd=ROOT,check=True)
for run in catalog['runs']:assert (ROOT/run['archive']).is_file()
print('PASS: 13 previews, preserved original ten, reproducible build, all inline/module scripts parse, archive links exist')
