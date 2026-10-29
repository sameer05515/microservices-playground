(() => {
  const $ = (selector) => document.querySelector(selector);
  const display = $('#timerDisplay');
  const label = $('#timerLabel');
  const sub = $('#timerSub');
  const toggle = $('#timerToggle');
  const ring = $('#ringProgress');
  const hint = $('#timerHint');
  const toast = $('#toast');
  const circumference = 2 * Math.PI * 96;
  let totalSeconds = 600;
  let remaining = totalSeconds;
  let interval = null;
  let running = false;
  let selectedTopic = null;
  let ended = false;

  ring.style.strokeDasharray = circumference;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timeout);
    showToast.timeout = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  function render() {
    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = (remaining % 60).toString().padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
    ring.style.strokeDashoffset = circumference * (1 - remaining / totalSeconds);
    label.textContent = running ? 'FOCUS IN PROGRESS' : (remaining === 0 ? 'SESSION COMPLETE' : 'READY WHEN YOU ARE');
    sub.textContent = remaining === 0 ? 'You showed up. That matters.' : `${Math.ceil(totalSeconds / 60)} minutes is enough to begin`;
    toggle.textContent = running ? 'Ⅱ Pause' : (remaining === 0 ? '↻ Start again' : '▶ Start');
  }
  function stopTimer() { if (interval) clearInterval(interval); interval = null; running = false; }
  function setDuration(minutes) {
    stopTimer();
    totalSeconds = minutes * 60;
    remaining = totalSeconds;
    ended = false;
    document.querySelectorAll('.preset').forEach(b => b.classList.toggle('active', Number(b.dataset.minutes) === minutes));
    hint.textContent = selectedTopic ? `Focus topic: ${selectedTopic.name}` : 'Phone silent. One tab. No need to finish everything.';
    render();
  }
  async function saveSession(minutes) {
    try {
      const response = await fetch('/sessions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ minutes, topicId: selectedTopic?.id || '', note: 'Focus timer completed' })
      });
      if (!response.ok) throw new Error('save failed');
      showToast(`Nice work! ${minutes} minutes logged. Small win achieved.`);
    } catch {
      showToast('Session complete! Refresh to retry logging if needed.');
    }
  }
  function complete() {
    stopTimer();
    remaining = 0;
    render();
    if (!ended) {
      ended = true;
      saveSession(Math.ceil(totalSeconds / 60));
      hint.textContent = 'Take a breath. You can stop here or choose another small step.';
      try { if ('Notification' in window && Notification.permission === 'granted') new Notification('Revision session complete', { body: 'You showed up. That matters.' }); } catch {}
      try { const Ctx = window.AudioContext || window.webkitAudioContext; if (Ctx) { const ctx = new Ctx(); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.connect(gain); gain.connect(ctx.destination); osc.frequency.value = 660; gain.gain.value = .06; osc.start(); osc.stop(ctx.currentTime + .14); } } catch {}
    }
  }
  toggle.addEventListener('click', () => {
    if (running) { stopTimer(); hint.textContent = 'Paused. Resume when you feel ready.'; render(); return; }
    if (remaining <= 0) { remaining = totalSeconds; ended = false; }
    running = true;
    hint.textContent = 'Just this one thing. You are allowed to keep it small.';
    if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission().catch(() => {});
    render();
    interval = setInterval(() => { remaining = Math.max(0, remaining - 1); render(); if (remaining === 0) complete(); }, 1000);
  });
  $('#timerReset').addEventListener('click', () => { setDuration(Math.round(totalSeconds / 60)); hint.textContent = 'Timer reset. Starting again is optional.'; });
  document.querySelectorAll('.preset').forEach(btn => btn.addEventListener('click', () => setDuration(Number(btn.dataset.minutes))));
  document.querySelectorAll('.topic-main').forEach(btn => btn.addEventListener('click', () => {
    selectedTopic = { id: btn.dataset.topicId, name: btn.dataset.topicName };
    const minutes = Number(btn.dataset.minutes) || 10;
    setDuration(minutes);
    hint.textContent = `Selected: ${selectedTopic.name}. Press Start when ready.`;
    showToast(`Selected "${selectedTopic.name}". One small step at a time.`);
    $('#timerPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }));
  $('#startFocus').addEventListener('click', () => {
    setDuration(10);
    $('#timerPanel').scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Your only task: start. Nothing else is required.');
  });
  render();
})();
