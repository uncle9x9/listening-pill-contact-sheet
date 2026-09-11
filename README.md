# Listening Pill Contact Sheet

Ten candidate designs for the **listening pill** — the small always-on indicator that tells you what a voice-driven agent is doing right now: listening, transcribing, transforming, searching, done.

**[View the contact sheet →](https://uncle9x9.github.io/listening-pill-contact-sheet/)**

Every concept on the sheet is *live*. Nothing here is a screenshot or a mockup image: each pill runs as real CSS and JavaScript, drives off a simulated audio level, and can be stepped through all six of its states from the controls on its card. What you see on the page is what the animation actually does.

## Vision

**Learn user behaviour, and help users learn more.**

The pill is the visible surface of that loop. It is on screen for the whole interaction, so it is the one place where the system can be honest about two things at once: what it understood from you, and what it is doing with that understanding. A pill that only says "busy" teaches nothing. A pill that distinguishes *hearing you* from *rewriting you* from *going to look something up* teaches you, over hundreds of small repetitions, what the tool is good at and how to ask better — while the system is learning the same thing from the other direction.

That is the bar each concept below is judged against, and it is why `readable` is scored separately from `delight`. A beautiful pill whose six states are indistinguishable is a failure of the vision, not a matter of taste.

## The ten concepts

| # | Name | Idea | Score |
|---|------|------|-------|
| 1 | Ribbon | One continuous line that listens, thinks, and ticks. | 15 |
| 2 | Orbit | Five satellites circle the mic; your voice is their gravity. | 16 |
| 3 | Quicksilver | A bead of mercury that swells with your voice and sets into glass. | 16 |
| 4 | Halo | One dot, one ring. The ring is your voice. | 12 |
| 5 | Ghostwriter | Your voice types in as ghost ink; the words set when the take is done. | 17 |
| 6 | Aurora Halo | The pill never moves. The light behind it breathes. | 15 |
| 7 | Notch Island | A capsule fused to the top edge that unfolds downward for results. | 14 |
| 8 | Cursor Anchor | A 28px dot that lives at your caret, not a HUD on your screen. | 10 |
| 9 | Glyph Arc | A bilingual 中/EN token that flips the moment your language is known. | 17 |
| 10 | Splitrail | One rail that chops itself in two the instant you speak a command. | 17 |

Scores are the sum of four independent judge axes — `distinct`, `feasible`, `readable`, `delight` — each out of 5, for 20 total. The per-axis breakdown and the judge's written reasoning for every concept are in [`src/pill-scores.json`](src/pill-scores.json) and are shown inline on each card.

The totals are deliberately close. They are a reading aid, not a verdict: #8 scores lowest because anchoring to the caret is genuinely hard to implement, not because the idea is weak, and #5, #9 and #10 tie at the top for quite different reasons. Read the notes before trusting the number.

## Layout

```
index.html                 the built contact sheet (this is what Pages serves)
src/pill-concepts.json     the ten concepts — html, css, js, states, AppKit notes, risks
src/pill-scores.json       per-axis judge scores and reasoning
src/build_pillsheet.py     regenerates index.html from the two JSON files
```

## Rebuilding

```sh
python3 src/build_pillsheet.py     # writes pill-sheet.html next to the script
```

The builder inlines every concept's CSS and ships the concepts as a JSON payload the page reads at runtime, so editing `pill-concepts.json` and re-running is enough to change a concept — no hand-editing of the generated HTML.

Two notes on the generated page. It loads Archivo, IBM Plex Mono and Newsreader from Google Fonts, and degrades to system stacks offline. It also looks for a `window.claude` runtime to persist which concept you picked; on GitHub Pages that is absent and picks fall back to `localStorage`, which is per-browser and per-device.

## Licence

MIT — see [LICENSE](LICENSE).
