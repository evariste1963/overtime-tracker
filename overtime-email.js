var DEFAULTS_KEY = 'ot_email_defaults';

function loadEmailDefaults() {
  var raw = localStorage.getItem(DEFAULTS_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  return {
    defaultTo: '',
    defaultCc: '',
    recipientName: '',
    senderName: '',
    subjectPrefix: 'Overtime Summary'
  };
}

function saveEmailDefaults(obj) {
  localStorage.setItem(DEFAULTS_KEY, JSON.stringify(obj));
}

function openEmailDefaultsModal() {
  var cfg = loadEmailDefaults();
  document.getElementById('defaultToInput').value = cfg.defaultTo;
  document.getElementById('defaultCcInput').value = cfg.defaultCc;
  document.getElementById('recipientNameInput').value = cfg.recipientName;
  document.getElementById('senderNameInput').value = cfg.senderName;
  document.getElementById('defaultsModal').style.display = 'flex';
}

function closeEmailDefaultsModal(ev) {
  if (ev && ev.target !== ev.currentTarget) return;
  document.getElementById('defaultsModal').style.display = 'none';
}

function saveEmailDefaultsFromForm() {
  var cfg = {
    defaultTo: document.getElementById('defaultToInput').value.trim(),
    defaultCc: document.getElementById('defaultCcInput').value.trim(),
    recipientName: document.getElementById('recipientNameInput').value.trim(),
    senderName: document.getElementById('senderNameInput').value.trim(),
    subjectPrefix: 'Overtime Summary'
  };
  saveEmailDefaults(cfg);
  closeEmailDefaultsModal();
}

window.shareOvertime = function () {
  var cfg = loadEmailDefaults();
  if (!cfg.defaultTo) {
    if (confirm('No default recipient set. Open email defaults?')) {
      openEmailDefaultsModal();
    }
    return;
  }

  var raw = localStorage.getItem('ot_tracker');
  if (!raw) return;
  var data = JSON.parse(raw);
  var wn = getWeekNumber(new Date());
  var lines = buildEmailBody(data, wn, cfg);
  var subject = cfg.subjectPrefix + ' \u2014 Week ' + wn;
  var body = lines.join('\n');
  if (navigator.share) {
    navigator.share({ title: subject, text: body }).catch(function () { });
  } else {
    var mailto = 'mailto:' + cfg.defaultTo
      + '?cc=' + encodeURIComponent(cfg.defaultCc)
      + '&subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  }
};

function buildEmailBody(data, wn, cfg) {
  var lines = [];
  var sep = '  --------------------------------------------------';
  var totalH = (getTotalMinutes(data) / 60).toFixed(2);
  var lastWn = wn === 1 ? 52 : wn - 1;

  lines.push('');
  lines.push(cfg.recipientName + ',');
  lines.push('');
  lines.push('Here is the summary of my extra hours this week:');
  lines.push('');

  var days = ['Banked', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  if (data.noLunch) days.push('Forgone lunch');

  days.forEach(function (day) {
    var v = day === 'Forgone lunch' ? 0.5 : (parseFloat(data.hours[day] || 0) || 0);
    var val = v.toFixed(2) + ' h';
    var label = day === 'Banked' ? 'Banked (wk ' + lastWn + ')' : day;
    lines.push('    ' + val.padStart(8) + '         ' + label);
  });

  lines.push(sep);
  lines.push('    ' + (totalH + ' h').padStart(8) + '         ' + 'Total');

  if (data.fridayFinish) {
    var finishMins = timeToMinutes(data.fridayFinish);
    if (!isNaN(finishMins)) {
      var earliestMins = finishMins - getTotalMinutes(data);
      var earliest = minutesToTime(earliestMins);
      lines.push(sep);
      lines.push('    ' + data.fridayFinish.padStart(8) + '         Scheduled finish');
      lines.push('    ' + earliest.padStart(8) + '         Earliest finish');
      if (data.proposedFinish) {
        var pMins = timeToMinutes(data.proposedFinish);
        if (!isNaN(pMins)) {
          lines.push('');
          lines.push('    ' + data.proposedFinish.padStart(8) + '         ACTUAL FINISH');
          lines.push('');
          var diff = (pMins - earliestMins) / 60;
          lines.push('    ' + ((diff >= 0 ? '+' : '') + diff.toFixed(2) + ' h').padStart(8) + '        Banked (wk ' + wn + ')');
        }
      }
      lines.push(sep);
    }
  }

  lines.push('');
  lines.push('Regards,');
  lines.push('');
  lines.push(cfg.senderName);
  lines.push('');
  return lines;
}
