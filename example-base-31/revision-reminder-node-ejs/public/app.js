const enableButton = document.getElementById('enableNotifications');
const notificationStatus = document.getElementById('notificationStatus');
let lastDailyNotice = '';
let lastDueSignature = '';

if (enableButton) {
  enableButton.addEventListener('click', async () => {
    if (!('Notification' in window)) {
      notificationStatus.textContent = 'This browser does not support notifications.';
      return;
    }
    const permission = await Notification.requestPermission();
    notificationStatus.textContent = permission === 'granted'
      ? 'Notifications enabled. Keep this dashboard open for reminders.'
      : 'Notifications are blocked. You can still use the dashboard to see due topics.';
    enableButton.textContent = permission === 'granted' ? 'Notifications enabled' : 'Try enabling again';
    if (permission === 'granted') checkReminders(true);
  });
}

async function checkReminders(force = false) {
  try {
    const [reminderResponse, settingsResponse] = await Promise.all([
      fetch('/api/reminders'), fetch('/api/settings')
    ]);
    const reminderData = await reminderResponse.json();
    const settings = await settingsResponse.json();
    const now = new Date();
    const dailyKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${settings.hour}:${settings.minute}`;
    const timeReached = now.getHours() > settings.hour ||
      (now.getHours() === settings.hour && now.getMinutes() >= settings.minute);
    if ('Notification' in window && Notification.permission === 'granted' &&
        reminderData.count > 0 && timeReached && (force || lastDailyNotice !== dailyKey)) {
      new Notification('Revision reminder', {
        body: `You have ${reminderData.count} topic(s) due. Start with one small review.`,
        tag: 'daily-revision-reminder'
      });
      lastDailyNotice = dailyKey;
    }
    const signature = reminderData.due.map(t => t.id).sort().join(',');
    if ('Notification' in window && Notification.permission === 'granted' &&
        reminderData.count > 0 && signature !== lastDueSignature && !force) {
      // A new due list can be announced once when the page is open.
      new Notification('Topics ready for revision', {
        body: `${reminderData.count} topic(s) are ready. You can revise just one.`,
        tag: 'due-topics-reminder'
      });
    }
    lastDueSignature = signature;
  } catch (error) {
    console.warn('Could not check reminders:', error);
  }
}
checkReminders();
setInterval(() => checkReminders(), 60 * 1000);
