// Referral flow prototype — Tanuh AI mobile app
(function () {
  const $app = document.getElementById('app');

  // ---------- Inline icons (ones not exported from Figma) ----------
  const I = {
    trash: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 21q-.825 0-1.412-.587Q5 19.825 5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413Q17.825 21 17 21Zm10-15H7v13h10ZM9 17h2V8H9Zm4 0h2V8h-2ZM7 6v13Z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 14q-1.25 0-2.125-.875T9 11V5q0-1.25.875-2.125T12 2q1.25 0 2.125.875T15 5v6q0 1.25-.875 2.125T12 14Zm-1 7v-3.075q-2.6-.35-4.3-2.325Q5 13.625 5 11h2q0 2.075 1.463 3.537Q9.925 16 12 16t3.538-1.463Q17 13.075 17 11h2q0 2.625-1.7 4.6-1.7 1.975-4.3 2.325V21Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2.5l1.7 5.1a3 3 0 0 0 1.9 1.9L18.7 11.2l-5.1 1.7a3 3 0 0 0-1.9 1.9L10 19.9l-1.7-5.1a3 3 0 0 0-1.9-1.9L1.3 11.2l5.1-1.7a3 3 0 0 0 1.9-1.9zM18.5 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>',
    referred: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  };

  const REASONS = [
    'White or red patch in the mouth',
    'Ulcer not healing for over 2 weeks',
    'Lump or thickening in the cheek',
    'Patient reports pain or bleeding',
  ];
  const SUMMARY_CHIPS = ['pain reduced', 'discomfort while eating', 'on medication', 'follow-up in 3 days'];
  const SUMMARY = 'The patient reports reduced pain but continued discomfort while eating. Advised to continue medication and avoid spicy food. Follow-up planned in three days.';
  const TRANSCRIPT = 'I spoke to the <mark>patient</mark> today. She mentioned that the pain has reduced slightly, but she still feels discomfort while eating. I’ve advised her to continue the medication and avoid spicy food. We’ll follow up again in three days to check if there’s any further improvement.';
  const IMAGE_COUNT = 7;

  const NOTES = {
    ai: {
      name: 'AI detects suspicion',
      sub: 'Referral is mandatory',
      pill: '<span class="pill danger"><img src="assets/stetho-danger.svg" alt="">Attention Needed</span>',
      title: 'Notes — AI Detects Suspicion',
      body: '<p>User is on the Referral screen. AI has detected a suspicious lesion, and the user only sees the <b>Refer Patient</b> button.</p>',
    },
    user: {
      name: 'AI doesn’t detect, worker suspects',
      sub: 'Worker can choose to refer',
      pill: '<span class="pill warning"><img src="assets/stetho.svg" alt="">User Advised</span>',
      title: 'Notes — AI Doesn’t Detect Suspicion',
      body: '<ul><li>“Do you want to refer?” shows Yes / No, with <b>No selected by default</b>.</li><li>Selecting <b>Yes</b> opens the additional referral flow.</li><li>The FLW selects the images they consider suspicious — these are included in the referral.</li><li>A <b>mandatory note</b> is required before referring: pick reasons, type, or record a voice note.</li></ul>',
    },
    none: {
      name: 'Nobody detects suspicion',
      sub: 'Nudged away from referring',
      pill: '<span class="pill brand"><img src="assets/pulse.svg" alt="">Healthy</span>',
      title: 'Notes — Nobody Detects Suspicion',
      body: '<p>Same screen as scenario 2, but here the worker should be nudged <b>away</b> from referring: No is preselected and <b>Next</b> continues without referral.</p><p>Referring stays possible (safety net for software errors), but costs extra effort: image selection + a mandatory reason.</p>',
    },
  };

  // ---------- State ----------
  let S;
  let timer = null;
  let sheetWasOpen = false;
  function reset(scenario, screen = 'main') {
    clearInterval(timer);
    S = {
      scenario: scenario || (S && S.scenario) || 'ai',
      screen, // start | main | done
      refer: 'no',
      selected: new Set(),
      reason: null, // {type:'list'|'text'|'audio', items, text}
      sheet: null, // {mode, checks:Set, text, secs, paused, playing, pos}
      toast: '',
      doneKind: '',
    };
    render();
    document.getElementById('scroll')?.scrollTo(0, 0);
  }

  // Navigation: start screen <-> scenario. Uses history so device/browser back works too.
  function openScenario(sc) {
    reset(sc);
    history.pushState({ scenario: sc }, '');
  }
  function goBack() {
    if (history.state && history.state.scenario) history.back(); // popstate shows start
    else reset(null, 'start');
  }
  window.addEventListener('popstate', () => {
    if (S.sheet) { // back closes an open sheet first
      clearInterval(timer);
      history.pushState({ scenario: S.scenario }, '');
      return set({ sheet: null });
    }
    reset(null, 'start');
  });

  function set(patch) { Object.assign(S, patch); render(); }
  function setSheet(patch) { S.sheet = Object.assign({}, S.sheet, patch); render(); }
  function toast(msg) {
    S.toast = msg; render();
    clearTimeout(toast.t);
    toast.t = setTimeout(() => { S.toast = ''; render(); }, 2200);
  }

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const bars = (n, seed, playedUpTo = -1) => {
    let out = '';
    for (let i = 0; i < n; i++) {
      const h = 6 + Math.round(Math.abs(Math.sin(i * 1.7 + seed) * Math.cos(i * 0.6)) * 20);
      out += `<i style="height:${h}px" class="${i < playedUpTo ? 'played' : ''}"></i>`;
    }
    return out;
  };

  // ---------- Views ----------
  function appbar(back = true) {
    return `
      <div class="appbar">
        ${back ? '<button class="icon-btn" data-act="back" title="Back"><img src="assets/back.svg" alt="Back"></button>' : ''}
        <div class="title"><b>Referral Decision</b><span>Oral Screening</span></div>
        <img src="assets/sync.svg" alt=""><img src="assets/search.svg" alt="">
      </div>`;
  }

  function startView() {
    return `
      <div class="theme-brand" style="display:contents">
        ${appbar(false)}
        <div class="page-head">Choose a scenario</div>
        <div class="scroll" id="scroll">
          <p class="body">Interactive prototype of the referral decision screen. Pick a scenario, then tap through the flow.</p>
          ${['ai', 'user', 'none'].map((k, i) => `
            <button class="scenario-card" data-act="open-scenario" data-scenario="${k}">
              <div class="row">
                <span class="source">Scenario ${i + 1}</span>
                ${NOTES[k].pill}
              </div>
              <div>
                <h2>${NOTES[k].name}</h2>
                <p class="body">${NOTES[k].sub}</p>
              </div>
              <span class="go">Start <img src="assets/arrow-right.svg" alt=""></span>
            </button>`).join('')}
          ${['ai', 'user', 'none'].map((k) => `
            <details class="note"><summary>${NOTES[k].title}</summary>${NOTES[k].body}</details>`).join('')}
        </div>
      </div>`;
  }

  function aiDetectsView() {
    return `
      <div class="theme-danger" style="display:contents">
        ${appbar()}
        <div class="page-head">Referral Decision</div>
        <div class="scroll">
          <div class="ai-card">
            <div class="row">
              <span class="source ai"><img src="assets/sparkle.svg" alt="">AI Assisted</span>
              <span class="pill danger"><img src="assets/stetho-danger.svg" alt="">Attention Needed</span>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <h2>Suspicious Lesion Detected</h2>
              <p class="body">App has found a Suspicious Lesion. Please refer the patient to a dentist.</p>
            </div>
          </div>
          ${[1, 2].map(() => `
            <div class="lesion-img">
              <img class="photo" src="assets/mouth.png" alt="Oral cavity image">
              <img class="outline" src="assets/lesion-outline.svg" alt="">
              <span class="tag"><img src="assets/sparkle-white.svg" alt="">Suspicion Lesion 85%</span>
            </div>`).join('')}
        </div>
        <div class="footer">
          <button class="btn primary" data-act="refer">Refer Patient <img src="assets/arrow-right.svg" alt=""></button>
        </div>
      </div>`;
  }

  function reasonCard() {
    const r = S.reason;
    const tag = { audio: 'Audio Note', text: 'Text Note', list: 'Selected Reason' }[r.type];
    let body = '';
    if (r.type === 'audio') {
      body = `
        <div class="ai-sum"><img src="assets/sparkle.svg" alt="">AI Summary</div>
        <div class="chips">${SUMMARY_CHIPS.map((c) => `<span class="chip">${c}</span>`).join('')}</div>
        <p class="small">${SUMMARY}</p>
        <button class="link-btn" data-act="open-transcript">Transcript</button>`;
    } else if (r.type === 'text') {
      body = `<p class="small">${escapeHtml(r.text)}</p>`;
    } else {
      body = `<div class="reason-list">${r.items.map((x) => `<span>${x}</span>`).join('')}</div>`;
    }
    return `
      <div class="reason-card">
        <div class="row">
          <h3>Reason</h3>
          <span class="pill">${tag}</span>
          <button class="trash" data-act="del-reason" title="Remove reason">${I.trash}</button>
        </div>
        ${body}
      </div>`;
  }

  function userView() {
    const yes = S.refer === 'yes';
    const theme = yes ? 'theme-warning' : 'theme-brand';
    const canRefer = yes && S.selected.size > 0 && S.reason;
    let missing = [];
    if (yes && S.selected.size === 0) missing.push('select at least one image');
    if (yes && !S.reason) missing.push('add a reason');

    const card = yes
      ? `<span class="source"><img src="assets/user.svg" alt="">User Advised</span>
         <span class="pill warning"><img src="assets/stetho.svg" alt="">Attention Needed</span>`
      : `<span class="source ai"><img src="assets/sparkle.svg" alt="">AI Assisted</span>
         <span class="pill brand"><img src="assets/pulse.svg" alt="">Healthy</span>`;

    const choice = (val, label) => `
      <button class="choice ${S.refer === val ? 'on' : ''}" data-act="choose" data-val="${val}">
        <span>${label}</span>${S.refer === val ? '<img src="assets/check-white.svg" alt="">' : ''}
      </button>`;

    const extra = !yes ? '' : `
      <div>
        <div class="grid-head">
          <h2>Select Suspicious Lesion Images</h2>
          <p class="small">Tap on the images to select${S.selected.size ? ` · ${S.selected.size} selected` : ''}</p>
        </div>
        <div class="grid">
          ${Array.from({ length: IMAGE_COUNT }, (_, i) => `
            <button class="thumb ${S.selected.has(i) ? 'on' : ''}" data-act="toggle-img" data-i="${i}" aria-pressed="${S.selected.has(i)}">
              <img class="photo" src="assets/mouth.png" alt="Captured image ${i + 1}">
              <span class="check"></span>
            </button>`).join('')}
        </div>
      </div>
      ${S.reason ? reasonCard() : `<button class="btn primary" data-act="open-sheet">Add a Reason <img src="assets/add-circle.svg" alt=""></button>`}
      <button class="btn ${canRefer ? 'primary' : 'disabled'}" data-act="refer" ${canRefer ? '' : 'aria-disabled="true"'}>
        Refer Patient <img src="assets/${canRefer ? 'arrow-right' : 'arrow-disabled'}.svg" alt="">
      </button>
      ${missing.length ? `<p class="hint">To refer, ${missing.join(' and ')}.</p>` : ''}`;

    return `
      <div class="${theme}" style="display:contents">
        ${appbar()}
        <div class="page-head">Referral Decision</div>
        <div class="scroll" id="scroll">
          <div class="ai-card">
            <div class="row">${card}</div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <h2>No Lesion Detected</h2>
              <p class="body">App found No Suspicious Lesion. But you noticed suspicious lesions. Would you like to refer the patient to a dentist?</p>
            </div>
          </div>
          <div class="question">
            <h2>Do you want to refer the patient?</h2>
            <div class="choices">${choice('no', 'No')}${choice('yes', 'Yes')}</div>
          </div>
          ${extra}
        </div>
        ${yes ? '' : `
        <div class="footer">
          <button class="btn outline md" data-act="previous">Previous</button>
          <button class="btn primary md" data-act="next">Next</button>
        </div>`}
      </div>`;
  }

  function doneView() {
    const referred = S.doneKind === 'referred';
    const items = [];
    if (referred && S.scenario !== 'ai') {
      items.push(`${S.selected.size} image${S.selected.size > 1 ? 's' : ''} attached`);
      const r = S.reason;
      items.push('Reason: ' + (r.type === 'audio' ? 'audio note (AI summary)' : r.type === 'text' ? 'text note' : `${r.items.length} selected reason(s)`));
    }
    if (referred && S.scenario === 'ai') items.push('AI-flagged images attached (85% suspicion)');
    return `
      ${appbar()}
      <div class="done">
        <div class="badge">${I.referred}</div>
        <h2>${referred ? 'Patient referred to a dentist' : 'Screening completed'}</h2>
        <p class="body">${referred ? 'The referral has been recorded and will sync with the dashboard.' : 'No referral was made for this patient.'}</p>
        ${items.length ? `<ul>${items.map((x) => `<li>${x}</li>`).join('')}</ul>` : ''}
        <button class="btn outline md" data-act="home">Back to scenarios</button>
      </div>`;
  }

  // ---------- Bottom sheet ----------
  function sheetView() {
    const sh = S.sheet;
    let inner = '';
    if (sh.mode === 'pick') {
      const anyChecked = sh.checks.size > 0;
      inner = `
        <h4>Tell us why, Select all that apply</h4>
        <div class="checks">
          ${REASONS.map((r, i) => `
            <label class="checkrow"><input type="checkbox" data-act="check" data-i="${i}" ${sh.checks.has(i) ? 'checked' : ''}>${r}</label>`).join('')}
        </div>
        ${anyChecked ? `
          <div class="row2">
            <button class="btn outline md" data-act="clear-checks">Clear</button>
            <button class="btn primary md" data-act="add-checks">Add</button>
          </div>` : `
          <h4>Not listed? Share it in your own words</h4>
          <div class="note-row">
            <div class="note-input">
              <input id="noteInput" placeholder="Add Note ..." value="${escapeHtml(sh.text)}" autocomplete="off" inputmode="none">
              ${sh.text ? `<button class="clear" data-act="clear-text" title="Clear">×</button>` : ''}
            </div>
            ${sh.text.trim()
              ? `<button class="round" data-act="add-text" title="Add note">${I.check}</button>`
              : `<button class="round" data-act="record" title="Record voice note">${I.mic}</button>`}
          </div>`}`;
    } else if (sh.mode === 'recording') {
      inner = `
        <h4>Not listed? Share it in your own words</h4>
        <div class="rec-box">
          <div class="label">${sh.paused ? 'Paused' : '<span class="dot-rec"></span>Recording'}</div>
          <div class="wave-row">
            <span>${fmt(sh.secs)}</span>
            <div class="wave ${sh.paused ? '' : 'live'}">${bars(Math.min(36, 8 + sh.secs * 2), 1)}</div>
          </div>
          <div class="rec-actions">
            <button class="round danger" data-act="discard-rec" title="Delete">${I.trash}</button>
            <button class="btn outline md" data-act="pause-rec">${sh.paused ? I.mic + ' Resume' : I.pause + ' Pause'}</button>
            <button class="round" data-act="stop-rec" title="Done">${I.check}</button>
          </div>
        </div>`;
    } else if (sh.mode === 'transcribing') {
      inner = `
        <h4>Not listed? Share it in your own words</h4>
        <div class="rec-box">
          <div class="label">Audio Note</div>
          <div class="wave-row">
            <span class="play">${I.play}</span>
            <div class="wave">${bars(36, 2)}</div>
            <span>${fmt(sh.secs)}</span>
          </div>
          <div class="ai-line shimmer">${I.sparkle} Transcribing...</div>
        </div>`;
    } else if (sh.mode === 'summary') {
      inner = `
        <h4>Not listed? Share it in your own words</h4>
        <div class="rec-box">
          <div class="ai-title">${I.sparkle} Summary</div>
          <div class="chips">${SUMMARY_CHIPS.map((c) => `<span class="chip">${c}</span>`).join('')}</div>
          <p class="transcript">${SUMMARY}</p>
          <button class="btn outline md" data-act="open-transcript-in-sheet">Transcript</button>
          <button class="btn primary md" data-act="save-audio">Save</button>
        </div>`;
    } else if (sh.mode === 'transcript') {
      const total = sh.secs || 46;
      inner = `
        <h4>Not listed? Share it in your own words</h4>
        <div class="rec-box">
          <button class="ai-title" data-act="transcript-back">${I.back} Transcription</button>
          <p class="transcript">${TRANSCRIPT}</p>
          <div class="wave-row" style="margin-top:24px">
            <button class="play" data-act="toggle-play">${sh.playing ? I.pause : I.play}</button>
            <div class="wave">${bars(36, 2, Math.round((sh.pos / total) * 36))}</div>
            <span>${fmt(sh.playing || sh.pos ? sh.pos : total)}</span>
          </div>
        </div>`;
    }
    const hasInput = sh.mode === 'pick' && sh.checks.size === 0;
    return `
      <div class="scrim ${sheetWasOpen ? '' : 'enter'} ${hasInput && kb.open ? 'kb-open' : ''}" data-act="scrim">
        <button class="sheet-close" data-act="close-sheet">Close</button>
        <div class="sheet">${inner}</div>
        ${hasInput ? `<div class="kb" id="kb">${kbHTML()}</div>` : ''}
      </div>`;
  }

  // ---------- Virtual keyboard ----------
  const kb = { open: false, shift: true, num: false };
  const ROWS = {
    abc: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'],
    num: ['1234567890', '@#₹_&-+()/', '*"\':;!?'],
  };
  function kbHTML() {
    const rows = kb.num ? ROWS.num : ROWS.abc;
    const key = (k) => {
      const label = !kb.num && kb.shift ? k.toUpperCase() : k;
      return `<button class="key" data-key="${escapeHtml(label)}">${escapeHtml(label)}</button>`;
    };
    return `
      <div class="kb-row">${[...rows[0]].map(key).join('')}</div>
      <div class="kb-row ${kb.num ? '' : 'inset'}">${[...rows[1]].map(key).join('')}</div>
      <div class="kb-row">
        <button class="key fn ${kb.shift && !kb.num ? 'on' : ''}" data-key="{shift}" title="Shift">${kb.num ? '=\\<' : '⇧'}</button>
        ${[...rows[2]].map(key).join('')}
        <button class="key fn" data-key="{bksp}" title="Backspace">⌫</button>
      </div>
      <div class="kb-row">
        <button class="key fn wide" data-key="{num}">${kb.num ? 'ABC' : '?123'}</button>
        <button class="key" data-key=",">,</button>
        <button class="key space" data-key=" ">English</button>
        <button class="key" data-key=".">.</button>
        <button class="key fn enter" data-key="{enter}" title="Done">${I.check}</button>
      </div>`;
  }
  function setKbOpen(open) {
    if (open && !kb.open) document.getElementById('kb')?.classList.add('anim');
    kb.open = open;
    const scrim = document.querySelector('.scrim');
    if (scrim) scrim.classList.toggle('kb-open', open && !!document.getElementById('kb'));
  }
  function refreshKb() {
    const el = document.getElementById('kb');
    if (el) el.innerHTML = kbHTML();
  }
  function pressKey(k) {
    const inp = document.getElementById('noteInput');
    if (!inp) return;
    let { value } = inp;
    let start = inp.selectionStart ?? value.length;
    let end = inp.selectionEnd ?? value.length;
    if (k === '{shift}') { if (!kb.num) { kb.shift = !kb.shift; refreshKb(); } return; }
    if (k === '{num}') { kb.num = !kb.num; refreshKb(); return; }
    if (k === '{enter}') {
      if (value.trim()) { setKbOpen(false); set({ reason: { type: 'text', text: value.trim() }, sheet: null }); }
      else { inp.blur(); }
      return;
    }
    if (k === '{bksp}') {
      if (start === end && start > 0) start--;
      value = value.slice(0, start) + value.slice(end);
    } else {
      value = value.slice(0, start) + k + value.slice(end);
      start += k.length;
    }
    inp.value = value;
    inp.setSelectionRange(start, start);
    // auto-capitalise at the start of a sentence, otherwise drop one-shot shift
    const wantShift = !value.trim() || /[.!?]\s$/.test(value.slice(0, start));
    if (kb.shift !== wantShift) { kb.shift = wantShift; refreshKb(); }
    inp.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // keep focus in the input while tapping keys
  $app.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-act=clear-text],[data-act=add-text]')) return e.preventDefault();
    if (e.target.id === 'noteInput') return setKbOpen(true);
    const keyEl = e.target.closest('[data-key]');
    if (!keyEl) {
      // tapping anywhere else hides the keyboard (like Android)
      if (kb.open && !e.target.closest('#kb')) setKbOpen(false);
      return;
    }
    e.preventDefault();
    keyEl.classList.add('down');
    pressKey(keyEl.dataset.key);
  });
  $app.addEventListener('pointerup', () => document.querySelectorAll('.key.down').forEach((k) => k.classList.remove('down')));
  $app.addEventListener('focusin', (e) => { if (e.target.id === 'noteInput') setKbOpen(true); });

  // ---------- Render ----------
  function render() {
    const scroll = document.getElementById('scroll');
    const scrollTop = scroll ? scroll.scrollTop : 0;
    const focused = document.activeElement && document.activeElement.id === 'noteInput';
    const caret = focused ? document.activeElement.selectionStart : null;

    let html;
    if (S.screen === 'start') html = startView();
    else if (S.screen === 'done') html = doneView();
    else html = S.scenario === 'ai' ? aiDetectsView() : userView();
    if (S.sheet) html += sheetView();
    sheetWasOpen = !!S.sheet;
    if (S.toast) html += `<div class="toast">${S.toast}</div>`;
    $app.innerHTML = html;

    const nScroll = document.getElementById('scroll');
    if (nScroll) nScroll.scrollTop = scrollTop;
    if (focused) {
      const inp = document.getElementById('noteInput');
      if (inp) { inp.focus(); inp.setSelectionRange(caret, caret); }
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // ---------- Recording / playback timers ----------
  function startRecTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
      if (!S.sheet || S.sheet.mode !== 'recording') return clearInterval(timer);
      if (!S.sheet.paused) setSheet({ secs: S.sheet.secs + 1 });
    }, 1000);
  }
  function startPlayback() {
    clearInterval(timer);
    const total = S.sheet.secs || 46;
    timer = setInterval(() => {
      if (!S.sheet || S.sheet.mode !== 'transcript' || !S.sheet.playing) return clearInterval(timer);
      const pos = S.sheet.pos + 1;
      if (pos >= total) { clearInterval(timer); setSheet({ playing: false, pos: 0 }); }
      else setSheet({ pos });
    }, 1000);
  }

  // ---------- Events ----------
  $app.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el) return;
    const act = el.dataset.act;
    if (act === 'scrim' && e.target !== el) return; // only clicks on the dim area itself
    if (act === 'check') return; // handled by change

    switch (act) {
      case 'open-scenario': return openScenario(el.dataset.scenario);
      case 'back':
        if (S.screen === 'done') return set({ screen: 'main' }); // done -> back to the decision screen
        return goBack();
      case 'home': return goBack();
      case 'refer':
        if (el.getAttribute('aria-disabled')) {
          return toast(S.selected.size === 0 ? 'Select at least one suspicious image' : 'Add a reason before referring');
        }
        return set({ screen: 'done', doneKind: 'referred' });
      case 'choose':
        return set({ refer: el.dataset.val });
      case 'previous':
        return goBack();
      case 'next':
        return set({ screen: 'done', doneKind: 'next' });
      case 'toggle-img': {
        const i = +el.dataset.i;
        S.selected.has(i) ? S.selected.delete(i) : S.selected.add(i);
        return render();
      }
      case 'open-sheet':
        Object.assign(kb, { open: false, shift: true, num: false });
        return set({ sheet: { mode: 'pick', checks: new Set(), text: '', secs: 0 } });
      case 'scrim':
      case 'close-sheet':
        clearInterval(timer);
        return set({ sheet: null });
      case 'clear-checks':
        return setSheet({ checks: new Set() });
      case 'add-checks':
        return set({ reason: { type: 'list', items: [...S.sheet.checks].sort().map((i) => REASONS[i]) }, sheet: null });
      case 'clear-text':
        setSheet({ text: '' });
        return document.getElementById('noteInput').focus();
      case 'add-text':
        return set({ reason: { type: 'text', text: S.sheet.text.trim() }, sheet: null });
      case 'record':
        setSheet({ mode: 'recording', secs: 0, paused: false });
        return startRecTimer();
      case 'pause-rec':
        return setSheet({ paused: !S.sheet.paused });
      case 'discard-rec':
        clearInterval(timer);
        return setSheet({ mode: 'pick', secs: 0 });
      case 'stop-rec':
        clearInterval(timer);
        setSheet({ mode: 'transcribing', secs: Math.max(S.sheet.secs, 1) });
        return setTimeout(() => { if (S.sheet && S.sheet.mode === 'transcribing') setSheet({ mode: 'summary' }); }, 2200);
      case 'open-transcript-in-sheet':
        return setSheet({ mode: 'transcript', from: 'summary', playing: false, pos: 0 });
      case 'transcript-back':
        clearInterval(timer);
        if (S.sheet.from === 'card') return set({ sheet: null });
        return setSheet({ mode: 'summary', playing: false, pos: 0 });
      case 'toggle-play':
        setSheet({ playing: !S.sheet.playing });
        if (S.sheet.playing) startPlayback(); else clearInterval(timer);
        return;
      case 'save-audio':
        return set({ reason: { type: 'audio', secs: S.sheet.secs }, sheet: null });
      case 'open-transcript':
        return set({ sheet: { mode: 'transcript', from: 'card', secs: S.reason.secs, playing: false, pos: 0 } });
      case 'del-reason':
        return set({ reason: null });
    }
  });

  $app.addEventListener('change', (e) => {
    if (e.target.dataset.act === 'check') {
      const i = +e.target.dataset.i;
      const checks = new Set(S.sheet.checks);
      e.target.checked ? checks.add(i) : checks.delete(i);
      setSheet({ checks });
    }
  });

  $app.addEventListener('input', (e) => {
    if (e.target.id === 'noteInput') {
      const hadText = !!S.sheet.text.trim();
      S.sheet.text = e.target.value;
      // re-render only when the mic/check button or clear button needs to swap
      if (hadText !== !!S.sheet.text.trim() || !e.target.value || e.target.value.length === 1) render();
    }
  });

  $app.addEventListener('keydown', (e) => {
    if (e.target.id === 'noteInput' && e.key === 'Enter' && S.sheet.text.trim()) {
      set({ reason: { type: 'text', text: S.sheet.text.trim() }, sheet: null });
    }
  });

  reset('ai', 'start');
})();
