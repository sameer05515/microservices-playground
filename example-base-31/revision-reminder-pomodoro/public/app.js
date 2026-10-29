(() => {
  const DURATIONS = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const TITLES = { focus: 'Time to focus', short: 'Take a short break', long: 'Take a longer break' };
  const CAPTIONS = { focus: 'ONE THING AT A TIME', short: 'REST YOUR MIND', long: 'YOU HAVE EARNED A PAUSE' };
  let mode = 'focus';
  let remaining = DURATIONS.focus;
  let running = false;
  let timerId = null;
  let endAt = null;
  let completedFocus = 0;
  const $ = id => document.getElementById(id);
  const timerText = $('timerText');
  const ring = $('progressRing');
  const startBtn = $('startBtn');
  const timerTitle = $('timerTitle');
  const timerCaption = $('timerCaption');
  const timerTip = $('timerTip');
  const circumference = 2 * Math.PI * 112;
  ring.style.strokeDasharray = circumference;
  ring.style.strokeDashoffset = 0;

  function showToast(message) {
    const toast = $('toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove('show'), 3200);
  }
  function render() {
    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = Math.floor(remaining % 60).toString().padStart(2, '0');
    timerText.textContent = `${mins}:${secs}`;
    document.title = `${mins}:${secs} · Focus Room`;
    const ratio = remaining / DURATIONS[mode];
    ring.style.strokeDashoffset = circumference * (1 - ratio);
    timerTitle.textContent = TITLES[mode];
    timerCaption.textContent = CAPTIONS[mode];
    startBtn.innerHTML = running ? '<span>Ⅱ</span> Pause timer' : `<span>▶</span> ${remaining === DURATIONS[mode] ? (mode === 'focus' ? 'Start focus' : 'Start break') : 'Resume timer'}`;
    document.querySelectorAll('.mode').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
    ring.style.stroke = mode === 'focus' ? '#6c63df' : mode === 'short' ? '#38a981' : '#e2a34b';
  }
  function stopTicker() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }
  function switchMode(nextMode) {
    stopTicker(); running = false; mode = nextMode; remaining = DURATIONS[mode]; endAt = null;
    timerTip.textContent = mode === 'focus' ? 'Put your phone aside. You only need to work on one topic.' : 'Step away from the screen. Stretch, breathe, drink some water.';
    render();
  }
  function startTicker() {
    running = true;
    endAt = Date.now() + remaining * 1000;
    stopTicker();
    timerId = setInterval(() => {
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      render();
      if (remaining <= 0) completeTimer();
    }, 250);
    render();
  }
  async function completeTimer() {
    stopTicker(); running = false; remaining = 0; render();
    if (mode === 'focus') {
      completedFocus++;
      const topicId = $('topicSelect').value;
      try {
        const response = await fetch('/api/sessions', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes: Math.round(DURATIONS.focus / 60), topicId })
        });
        if (response.ok) await refreshStats();
      } catch (error) { console.error(error); }
      notify('Focus session complete', 'Well done. Take a break—you have earned it.');
      showToast('Focus session complete! Your progress has been saved.');
      timerTip.textContent = 'You showed up for one focus session. That counts. Take a break now.';
      switchMode(completedFocus % 4 === 0 ? 'long' : 'short');
    } else {
      notify('Break finished', 'Ready for one more gentle focus session?');
      showToast('Break complete. Start again when you feel ready.');
      switchMode('focus');
    }
  }
  function notify(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body });
    else showToast(`${title} — ${body}`);
    try { const audio = new AudioContext(); const oscillator = audio.createOscillator(); const gain = audio.createGain(); oscillator.connect(gain); gain.connect(audio.destination); oscillator.frequency.value = 660; gain.gain.value = 0.045; oscillator.start(); oscillator.stop(audio.currentTime + 0.18); oscillator.onended = () => audio.close(); } catch (_) {}
  }
  async function refreshStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      $('minutesToday').textContent = data.minutesToday;
      $('sessionsToday').textContent = data.sessionsToday;
      $('goalLabel').textContent = `${data.minutesToday} / 60 min`;
      $('progressBar').style.width = `${Math.min(100, data.minutesToday / 60 * 100)}%`;
    } catch (e) { console.warn('Stats refresh failed', e); }
  }
  startBtn.addEventListener('click', () => {
    if (running) {
      stopTicker(); running = false; endAt = null; render();
    } else startTicker();
  });
  $('resetBtn').addEventListener('click', () => { stopTicker(); running = false; remaining = DURATIONS[mode]; endAt = null; render(); showToast('Timer reset. Start whenever you are ready.'); });
  $('skipBtn').addEventListener('click', () => { switchMode(mode === 'focus' ? 'short' : 'focus'); showToast('Timer switched.'); });
  document.querySelectorAll('.mode').forEach(btn => btn.addEventListener('click', () => switchMode(btn.dataset.mode)));
  $('breakBtn').addEventListener('click', () => switchMode('short'));
  $('addTopicToggle').addEventListener('click', () => {
    $('addTopicForm').classList.toggle('hidden');
    if (!$('addTopicForm').classList.contains('hidden')) $('addTopicForm').querySelector('input').focus();
  });
  if ('Notification' in window && Notification.permission === 'default') {
    // Ask only after an explicit timer interaction, not on page load.
    startBtn.addEventListener('click', async function requestOnce() {
      if (!running) return;
      try { await Notification.requestPermission(); } catch (_) {}
      startBtn.removeEventListener('click', requestOnce);
    });
  }
  render();
})();
