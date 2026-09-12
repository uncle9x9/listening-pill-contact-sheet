# Listening Pill Design Archive

[Open the live archive](https://uncle9x9.github.io/listening-pill-contact-sheet/)

A focused collection of listening / recording HUD visualizations: ten original Anthropic Claude Code concepts and three OpenAI Codex · Visualize studies (Still, Weave, Relay).

Filter by provider, recorded model and effort; select up to three designs for side-by-side comparison; synchronize seven interface states, scenario, appearance and simulated volume. Comparison links are shareable. Each design includes its available prompt and production record, with an untouched original demonstration linked separately.

These runs used different prompts and context. This is a design archive, not a controlled model benchmark. Missing model versions, effort and prompts are explicitly marked as unrecorded. No microphone, model API, login or API key is required.

## Maintain and preview

Requires Python 3.9+ and Node.js 18+ for tests. No package installation is required.

```sh
python3 src/build_archive.py
node --test tests/core.test.mjs
python3 tests/check_build.py
python3 -m http.server 8000 --bind 127.0.0.1
```

Open http://127.0.0.1:8000/. GitHub Pages publishes the repository root from `main`.

- `src/catalog.json`: public run provenance and design metadata.
- `src/build_archive.py`: generates isolated previews and `assets/catalog.mjs`.
- `index.html`, `assets/app.mjs`, `assets/core.mjs`, `assets/archive.css`: comparison interface.
- `archives/claude-original.html`, `archives/codex-original.html`: preserved original demonstrations.
- `src/pill-concepts.json`, `src/pill-scores.json`: original ten concepts and their original judge notes. Notes are not cross-model scores.
- `src/build_pillsheet.py`: legacy contact-sheet builder; not the current website entry point.

See [CONTRIBUTING.md](CONTRIBUTING.md) to add another provider/model run. Keep existing records when adding new submissions; rebuild and commit generated previews alongside source changes. Do not replace the root index with a single run's contact sheet.
