export const catalog = {
  "schema_version": 1,
  "runs": [
    {
      "id": "claude-original",
      "provider": "Anthropic",
      "tool": "Claude Code",
      "model": null,
      "model_family": null,
      "effort": null,
      "created_at": null,
      "recorded_at": "2026-09-11",
      "archive": "archives/claude-original.html",
      "prompt": null,
      "prompt_context": "原始十款 Listening Pill 設計。原始 prompt 及執行設定未隨公開作品提交。",
      "provenance": "廠商與工具由作品持有人提供。模型、effort、生成日期及原始 prompt 未記錄。",
      "reference": null
    },
    {
      "id": "codex-three",
      "provider": "OpenAI",
      "tool": "Codex · Visualize",
      "model": null,
      "model_family": "GPT-6",
      "effort": null,
      "created_at": "2026-09-10",
      "recorded_at": "2026-09-11",
      "archive": "archives/codex-original.html",
      "prompt": "請你create三個好過佢。",
      "prompt_context": "使用 Visualize，參考當時開啟的 Listening Pill Contact Sheet 十款設計，製作三款替代方案。這次生成有參考原作，並非與原作使用相同 prompt 的獨立測試。",
      "provenance": "保存原對話中的使用者 prompt。對話助手標示為 GPT-6；精確模型 ID 與 reasoning effort 未記錄。",
      "reference": "archives/claude-original.html"
    }
  ],
  "concepts": [
    {
      "id": "claude-01",
      "run_id": "claude-original",
      "name": "Ribbon",
      "tagline": "One continuous line that listens, thinks, and ticks.",
      "source_index": 1,
      "description": "Replace the six bars with a single stroke: a Catmull-Rom ribbon of seven anchor points drawn as six cubic segments inside a 96x28 stage on the left of a 220x44 capsule. In listening, audio level drives the ribbon's amplitude and travel speed (attack fast, decay slow) with a lagged accent-coloured trail behind it for depth. Because the ribbon is always exactly M + 6C, it can be tweened by the compositor: transcribing/transforming/searching keep the same path but switch the stroke to a moving dash pattern (direction and cadence encode which job is running); done tweens the seven anchors into a checkmark in --ok; failed collapses to a flat --err line with a short shake. Done expands the capsule to a card (max 420px) with the transcript preview, or a search result card (title + snippet) for the '上網查下…' path. The capsule uses --bg at 88% over a backdrop blur with a 1px --fg-derived hairline, so it reads as native vibrancy in both Light and Dark Mode rather than a forced dark HUD.",
      "preview": "previews/claude-01.html",
      "original_score": {
        "index": 1,
        "distinct": 3,
        "feasible": 5,
        "readable": 3,
        "delight": 4,
        "note": "Cheapest possible morph story: fixed 1 M + 6 C means Core Animation interpolates the wave-to-check exactly, and lineDashPhase runs entirely on the render server at ~0% CPU. The weakness is the state grammar — transcribing/transforming/searching are all 'same path, different dash cadence and direction', which no user will ever decode; the label and stroke color are doing all the real work, so three of six states are effectively unlabeled geometry. The waveform organ is also near-identical to #9's arc, minus #9's semantic token."
      }
    },
    {
      "id": "claude-02",
      "run_id": "claude-original",
      "name": "Orbit",
      "tagline": "Five satellites circle the mic; your voice is their gravity. Release, and they fall into the sentence.",
      "source_index": 2,
      "description": "A 44px capsule whose left cell is a tiny orbital system: a mic glyph at the centre with two counter-rotating rings of dots (3 inner, 2 outer). Audio level is gravity: louder speech spins the rings faster, pushes the dots outward and swells a soft accent halo behind the mic. On release (transcribing) the rings unwind to zero and the five dots fall onto the text baseline as a typing ellipsis; when text arrives (done) they converge into a single point that becomes a check, and the preview slides in. Transforming swaps the mic for a sparkle and the dots orbit at a calm constant speed in accent colour; searching swaps to a magnifier with a wider orbit and the label \"上網查下…\", then the done card expands upward above the pill with title and snippet. Failure scatters the dots outward in --err and leaves the message. Everything is driven by two CSS custom properties (--lv, --ph) written by the host tick, so the only per-frame work is two composited transforms. The capsule uses --bg/--fg tokens so it reads as a native HUD in both Light and Dark Mode instead of always-dark.",
      "preview": "previews/claude-02.html",
      "original_score": {
        "index": 2,
        "distinct": 3,
        "feasible": 5,
        "readable": 4,
        "delight": 4,
        "note": "Best engineering judgment in the batch on two specific points: replacing a blurred halo with a radial CAGradientLayer (avoiding CIFilter on a live layer) and the layer.speed/timeOffset trick so rotation speed changes without jumping. Readability is carried by the glyph swap (mic/sparkle/magnifier/check), not the orbit, which is the right call — the dots falling onto the baseline as a typing ellipsis is a legible causal metaphor. Loses distinctness because 'concentric ring pulsing around a central glyph' is the most crowded family here (#4, #7, #8) and orbiting dots are a well-worn AI-assistant trope."
      }
    },
    {
      "id": "claude-03",
      "run_id": "claude-original",
      "name": "Quicksilver",
      "tagline": "A bead of mercury that swells with your voice and sets into glass when the words arrive.",
      "source_index": 3,
      "description": "The pill is not a box holding bars; it is a single drop of liquid resting on the bottom edge of the screen. The capsule body is the host material color (--bg) so it reads as native HUD glass in both Light and Dark Mode, but its silhouette is alive: an SVG goo filter (blur + alpha threshold) merges the capsule with three small metaballs living in its left end, and a static feTurbulence field displaces the merged edge so the rim ripples. Audio level drives exactly three cheap numbers: displacement scale (edge ripple amplitude), bead radius, and bead separation (the metaball necks stretch as you get louder, then snap back with a fast-attack/slow-release smoother). The beads are the only saturated color and they carry the state: --accent while listening, --muted while transcribing (beads chase each other left-to-right like a peristaltic pump, literally pushing the audio through the pipe), --warn while transforming (beads orbit), --accent plus a spinning dashed ring glyph while searching, --ok when done, --err when failed. Done and failed are the payoff: the ripple settles to zero, the goo SVG cross-fades out and the drop 'sets' into a crisp, slightly taller glass card (260x112 max) showing the transcript or search preview with a drawn-in check or cross; failed adds a single lateral shudder. Cancel melts the drop downward into the screen edge; idle-appear is the reverse with a spring overshoot. Text always sits on --bg with --fg so contrast is inherited from the host theme, never from the accent.",
      "preview": "previews/claude-03.html",
      "original_score": {
        "index": 3,
        "distinct": 5,
        "feasible": 3,
        "readable": 3,
        "delight": 5,
        "note": "The most memorable object in the set and the only liquid one — a bead of mercury that sets into glass is a payoff nothing else here can match. But it is the only concept whose web prototype cannot validate its native cost: the preview runs feTurbulence + feDisplacementMap while the AppKit build substitutes per-tick path perturbation, so what reviewers approve is not what gets measured. Masking an NSVisualEffectView with a 44-point path rebuilt at 30 Hz plus a per-frame shadowPath is the one place in this batch where 3% is genuinely in play. Light Mode separation depends entirely on the --shadow token over a white desktop, which the author concedes."
      }
    },
    {
      "id": "claude-04",
      "run_id": "claude-original",
      "name": "Halo",
      "tagline": "One dot, one ring. The ring is your voice; when it sweeps, Inflow is thinking.",
      "source_index": 4,
      "description": "Halo throws away the capsule entirely while you speak: the listening state is a 56x56 disc at bottom-center containing nothing but a centre dot and a single thin ring. Audio level drives exactly one property — the ring's stroke width (1.5px silent, ~7.5px loud) plus a slight opacity lift — with a fast-attack / slow-release envelope so it breathes rather than jitters. On release, the ring breaks into a 30% arc and sweeps clockwise (the Siri-ring gesture) for transcribing; transforming adds a second counter-rotating arc in --accent; searching ('上網查下…') keeps a slow sweep and adds a tiny satellite orbiting the ring while the disc slides open to the right into a ≤260px capsule that carries the query/result preview. Done snaps the ring to --ok and the dot draws itself into a check while the capsule opens with the transcript preview (2 lines, ellipsised); failed does the same in --err with an X and the error text. Cancel/hide shrinks the disc back to the dot and fades. Because the only chrome is --bg with a hairline of --fg at 12% and a --shadow drop, it reads as a native disc in Light Mode and a HUD in Dark Mode without any theme-specific colour. The whole thing is one CAShapeLayer ring, one dot layer, two stroked paths and one rotation animation — trivially <3% CPU.",
      "preview": "previews/claude-04.html",
      "original_score": {
        "index": 4,
        "distinct": 2,
        "feasible": 5,
        "readable": 2,
        "delight": 3,
        "note": "Cheapest to build (two property writes per tick, sweeps on the render server) and the discipline of 'one dot, one ring' is admirable, but it pays for that with the worst state clarity here. A 56px disc with no text may not read as a microphone at all — the author's own first risk proposes an onboarding tooltip, which is an admission the design does not self-explain. Transforming vs searching differ only by a satellite dot and a caption, and ring stroke width as the sole level cue collapses in a noisy room. Visually this is #8 relocated to the bottom edge."
      }
    },
    {
      "id": "claude-05",
      "run_id": "claude-original",
      "name": "Ghostwriter",
      "tagline": "A single line of paper: your voice types in as ghost ink, and the words set when the take is done.",
      "source_index": 5,
      "description": "Instead of a meter, the pill is one line of text with a caret. While you hold Right Option, faint \"ghost glyphs\" (rounded strokes of word-ish width, grouped into words with gaps) are typed onto the line at a cadence and stroke-width driven by the audio level; the caret's ink level and the hairline rule under the text fill with the level too. Loud speech types fast and wide, silence leaves the caret blinking on empty paper, so you can see whether the mic is hearing you without a VU bar. On release the ghost line washes (transcribing), tints accent and re-sweeps (transforming), or turns into a dotted crawl with a magnifier badge (searching). On done the ghost strokes solidify to full-ink text for one beat and are replaced by the real transcript, the pill widening to a preview; on failure the line turns error-red with a short nudge. The card is a plain rounded rect on --bg with --fg text and a --shadow drop, so it is Light/Dark native by construction with no forced dark HUD. If the host ever has streaming partials, it sets data-text during listening and the same line shows real ghost words.",
      "preview": "previews/claude-05.html",
      "original_score": {
        "index": 5,
        "distinct": 5,
        "feasible": 4,
        "readable": 3,
        "delight": 5,
        "note": "The only concept built from typography rather than a meter, and the only one that gets strictly better the day streaming partials exist — the ghost line simply starts showing real words. 'Is the mic hearing me' is answered better than by any bar graph. The serious problem is honesty: those glyphs are synthetic level noise shaped like words, and users will read them as live recognition, so the pill would be lying at exactly the moment it looks most impressive. Processing states are also weakly differentiated (wash vs sweep vs dotted crawl on the same line)."
      }
    },
    {
      "id": "claude-06",
      "run_id": "claude-original",
      "name": "Aurora Halo",
      "tagline": "The pill never moves. The light behind it breathes with your voice.",
      "source_index": 6,
      "description": "A perfectly still 220x44 capsule sits bottom-center; every bit of motion lives in a soft radial glow layered behind it. While listening, the halo's radius and brightness track the mic level and its hue slides from accent (quiet) toward ok (loud) via two stacked gradient layers cross-fading, so the user reads energy from the edge of their vision without any bars or spinners to parse. Transcribing collapses the halo into a slow, muted breath; transforming alternates the two hues in a lazy lighthouse sweep; searching widens the halo into a wide, low horizon line to signal \"reaching out\". Done retracts the halo to a crisp ok-coloured rim while the capsule grows once (max 260px, taller) to preview the text; failed flashes the err halo once then dims to a faint ring. The capsule surface uses only --bg/--fg/--shadow so it is genuinely native in Light Mode (a frosted white lozenge) and Dark Mode (a graphite lozenge) instead of the current always-dark HUD. Nothing inside the pill animates except a text swap, which keeps the CALayer tree to three layers and lets the whole thing run as a transform/opacity-only animation.",
      "preview": "previews/claude-06.html",
      "original_score": {
        "index": 6,
        "distinct": 4,
        "feasible": 5,
        "readable": 2,
        "delight": 4,
        "note": "A real inversion — motion moves outside the object — and technically the cheapest thing here: two cached gradient textures driven by transform and opacity only, no filters. But it stakes legibility on the user's wallpaper rather than on the tokens, which is the one thing the readable criterion asks it not to do; on a bright Light Mode desktop a 22-77% accent glow can vanish. Worse, the premise guarantees that a user looking at the capsule sees nothing change between listening and transcribing except a text swap, and distinguishing 'muted breath' from 'lighthouse sweep' from 'wide horizon' by glow shape is not a glanceable distinction."
      }
    },
    {
      "id": "claude-07",
      "run_id": "claude-original",
      "name": "Notch Island",
      "tagline": "The notch grows a voice. A capsule fused to the top edge that breathes with your audio and unfolds downward for results.",
      "source_index": 7,
      "description": "The pill is docked flush to the top-center of the screen, directly beneath the MacBook notch (or below the menu bar on notch-less displays). Its top corners are square and its bottom corners fully rounded, so it reads as the notch itself extending downward rather than a floating window. Idle-appear: it slides out of the notch (translateY from -100%) in ~240 ms with a slight overshoot. Listening: no bar graph. A single \"orb\" on the left carries a solid dot plus two concentric halo rings; audio level drives the ring scale (1.0 to 1.9x) and opacity, so speech looks like sound radiating out of the notch. Level is smoothed in the tick with fast attack / slow release so the halo feels physical, not jittery. A hairline \"progress seam\" along the top edge sweeps left-to-right during transcribing / transforming / searching, tinted by --accent (transcribe), --warn (transform) and --accent (search), with the label swapping in place. Done: the capsule widens to 360 px and unfolds a body panel showing the transcribed text with an --ok rail; the orb becomes a check. Failed: same unfold, --err rail, orb becomes an X, label shows the error. Searching / search result: unfolds a card with the spoken query and result lines (the \"上網查下…\" prefix flow), mirroring the competitor's result window but anchored at the notch instead of the bottom. Hide/cancel: retracts back up into the notch. All surfaces use the host tokens, so the capsule is a real Light Mode object (off-white with hairline border and soft shadow) and a real Dark Mode object (near-black) rather than a forced-dark HUD.",
      "preview": "previews/claude-07.html",
      "original_score": {
        "index": 7,
        "distinct": 3,
        "feasible": 3,
        "readable": 4,
        "delight": 4,
        "note": "The most quotable concept and the strongest state clarity of the ring family — top-edge seam sweep, glyph swap, and a colored rail on an unfolding panel are all unambiguous in both themes. Cost is not CPU (five property writes per tick) but environment: safeAreaInsets anchoring, non-notch and external displays, auto-hidden menu bars, Spaces transitions, and status-item collision are a long tail of real work, and on a large display the top edge is the furthest possible point from the caret for a caret-local act. The internal orb is also the same level-driven concentric ring as #2/#4/#8."
      }
    },
    {
      "id": "claude-08",
      "run_id": "claude-original",
      "name": "Cursor Anchor",
      "tagline": "A 28px dot that lives at your caret, not a HUD that lives on your screen.",
      "source_index": 8,
      "description": "Inflow's mic press is a caret-local act — you're already looking at the text you're dictating into. Cursor Anchor puts a minimal 28×28 indicator right where the text insertion point is, so there is no eye-travel to a bottom-center bar at all. It stays a plain dot+ring during listening/transcribing/transforming (near-zero footprint, genuinely native-looking — like a smart text cursor, not a widget). Only when there's something to actually read — a search result or a done/failed transcript preview — does it grow sideways into a compact card anchored to that same point, then collapses back to the dot on dismiss. The level meter is a single breathing ring stroke-dasharray driven by audio level, not six bars — reads as \"alive\" at a glance without needing width to show gradation. Everything is drawn with two circles, one path arc, and inline glyphs — no images, no library, cheap enough to redraw at 30Hz on a CALayer.",
      "preview": "previews/claude-08.html",
      "original_score": {
        "index": 8,
        "distinct": 3,
        "feasible": 2,
        "readable": 2,
        "delight": 3,
        "note": "Strongest premise (zero eye travel) attached to the weakest execution path. Caret rects via AX are unreliable in exactly this product's target apps — Electron editors, JetBrains, terminals, WezTerm/tmux — so the bottom-center fallback becomes the common case and the product feels inconsistent per app; add edge-aware repositioning and per-state panel frame moves and this is the most AppKit complexity for the least visual payoff. Three states share one 28px dot+ring with no label, and it sits on top of user text where contrast is unpredictable. The author's final risk retires the premise: users not already looking at the caret miss it entirely."
      }
    },
    {
      "id": "claude-09",
      "run_id": "claude-original",
      "name": "Glyph Arc",
      "tagline": "A bilingual 中/EN token that flips the moment your language is known, above one living arc of breath.",
      "source_index": 9,
      "description": "Most dictation HUDs shout \"I am a microphone\" with a row of bouncing bars. Glyph Arc says something the user actually cannot know otherwise: *which language I think you are speaking*. The pill has two organs only.\n\n**The token (left).** A 26px squircle carrying a single glyph. It starts on a neutral 〜 mark, and the instant the recognizer's language posterior crosses threshold mid-utterance it performs a 180° Y-axis card flip to 中 or EN — a hard, 260ms mechanical commitment, not a fade. Flipping back mid-sentence (code-switching Cantonese→English, which is the actual daily reality of this user) is legal and reads as the app tracking you, not guessing once. The token doubles as the state carrier: it flips to ✳ for transforming, a globe arc for searching, ✓ for done, ! for failed. One element, one flip verb, six meanings.\n\n**The arc (right).** No bars. A single smooth stroke, tapered to zero at both ends by a squared sine envelope, so it is always a closed gesture rather than a clipped waveform — it never touches the pill edges, which is what makes it read as calligraphic instead of technical. Amplitude is audio level, phase drifts rightward at a rate that itself scales with level, so loud speech reads as *faster and taller*, silence flattens it to a hairline in ~120ms. A ghost trail path lags the main stroke by 0.42rad at 72% amplitude, giving depth from two paths instead of a blur filter.\n\nState grammar rides on the same arc: transcribing collapses it to a hairline with a dash shuttle running left→right (the text is arriving); transforming holds the hairline but the trail counter-rotates as a slow lemniscate hint; searching sweeps a short dashed segment like a radar return. done/failed retire the arc to a 2px underline in --ok/--err beneath a two-line text preview, and the pill grows only downward-and-right from its anchored bottom-center, so the token never moves on screen.\n\nTheme nativeness comes from never painting a color the host did not give us: the body is `color-mix(in srgb, var(--bg) 92%, transparent)` over a 1px hairline of `color-mix(--fg 12%, transparent)`, so in Light Mode it is a pale vibrancy chip and in Dark Mode a smoked HUD, with the same code. This is the one concept here that deliberately abandons the always-dark HUD convention — 秘塔's window looks foreign on a light desktop, and that is the seam to win.",
      "preview": "previews/claude-09.html",
      "original_score": {
        "index": 9,
        "distinct": 4,
        "feasible": 4,
        "readable": 5,
        "delight": 4,
        "note": "Best readability in the batch, and the only concept that treats theming as an engineering problem rather than a color list — performAsCurrentDrawingAppearance plus theme-change KVO is the actual correct answer, since CALayer does not resolve dynamic NSColors, and it is also the only entry specifying VoiceOver announcements for a non-activating panel. The unit-amplitude path scaled per frame (option 2) plus 'stop touching layers after 300 ms of silence' is the smartest implementation here. The 中/EN flip shows information no other concept shows and is specifically right for this owner's code-switching, but it is a bet on streaming language ID the pipeline may not deliver; the arc itself is #1's ribbon."
      }
    },
    {
      "id": "claude-10",
      "run_id": "claude-original",
      "name": "Splitrail",
      "tagline": "One rail that chops itself in two the instant you speak a command.",
      "source_index": 10,
      "description": "Splitrail treats the pill as a single command rail rather than a mic indicator. While you hold Right Option it is one undivided capsule: a right-to-left scrolling scope of 7 bars (a history buffer, not 7 independent meters — so the wave visibly travels, like speech moving down a wire) with a thin accent underline whose width tracks instantaneous level. The moment the recognizer sees a command prefix (上網查下 / 幫我改 / translate), the rail physically chops: a 1px hairline seam scales in from the centreline, the shell does a single 140ms squash-and-settle, and a command chip (glyph + 上網查下) slides in from the left while the payload — your remaining words — is pushed right and continues streaming as live text. The user literally sees their sentence being parsed into verb + object. That split is the whole identity: state is communicated by geometry, not by colour changes or spinner swaps, which is what keeps it readable at 232px in both themes. Undivided = plain dictation, divided = a command is running, and the chip tells you which one. Results arrive as a separate card that grows underneath the rail (grid-template-rows 0fr→1fr, so no measured heights), skeleton rows while searching, ranked rows on done — the rail itself never grows past 56px, so the thing you stare at while talking stays constant. Failure collapses the seam back and reddens only the badge: the rail heals, it does not shout. Everything is drawn from --bg/--fg plus colour-mix hairlines, so it reads as a native HUD sheet in Light Mode and as a vibrancy panel in Dark without a single hard-coded value.",
      "preview": "previews/claude-10.html",
      "original_score": {
        "index": 10,
        "distinct": 4,
        "feasible": 5,
        "readable": 4,
        "delight": 4,
        "note": "The only concept where geometry encodes parsing rather than audio — undivided means dictation, divided means a command is running, and the chip names which. That binary reads identically in both themes with no color semantics to learn, which is the most robust readability story here, and it is cheap (seven transform writes plus a ring buffer). Deductions: traveling-wave bars are a worse loudness meter than mirrored bars, so the accent underline becomes load-bearing; and a chop-then-heal on a retracted hypothesis will read as a glitch unless the split waits for a final prefix. Also the only entry that thought about Dock collision."
      }
    },
    {
      "id": "codex-still",
      "run_id": "codex-three",
      "name": "Still · 呼吸核",
      "tagline": "聲音有回應，視線留喺文字。",
      "source_concept": "still",
      "description": "固定位置的膠囊，用呼吸核心回應音量；處理狀態用文字說明，完成後收斂為確認記號。",
      "preview": "previews/codex-still.html"
    },
    {
      "id": "codex-weave",
      "run_id": "codex-three",
      "name": "Weave · 雙語織",
      "tagline": "一句粵語，容得落 English。",
      "source_concept": "weave",
      "description": "以可核對的草稿為主角，保留粵語與英文詞彙；改寫完成後保留原句，方便比較。",
      "preview": "previews/codex-weave.html"
    },
    {
      "id": "codex-relay",
      "run_id": "codex-three",
      "name": "Relay · 指令匣",
      "tagline": "講完、睇清、再套用。",
      "source_concept": "relay",
      "description": "把指令、目的地與結果分開顯示。完成後先展示預覽，再由使用者確認套用。",
      "preview": "previews/codex-relay.html"
    }
  ]
};
