window.EmailConfig = {
  defaultTo: 'annette.bate@dncompany.com',
  defaultCc: 'neill.yates@dncompany.com',
  subjectPrefix: 'Overtime Summary',
};

window.shareOvertime = function () {
  var raw = localStorage.getItem('ot_tracker');
  if (!raw) return;
  var data = JSON.parse(raw);
  var wn = getWeekNumber(new Date());
  var lines = buildEmailBody(data, wn);
  var subject = EmailConfig.subjectPrefix + ' \u2014 Week ' + wn;
  var body = lines.join('\n');
  if (navigator.share) {
    navigator.share({ title: subject, text: body }).catch(function () { });
  } else {
    var mailto = 'mailto:' + EmailConfig.defaultTo
      + '?cc=' + encodeURIComponent(EmailConfig.defaultCc)
      + '&subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
    window.location.href = mailto;
  }
};

function buildEmailBody(data, wn) {
  var lines = [];
  lines.push('Annette,');
  lines.push('');
  lines.push('Here is the summary of my extra hours this week:');
  lines.push('');
  lines.push('');
  ['Banked', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'].forEach(function (day) {
    var v = parseFloat(data.hours[day] || 0) || 0;
    var label = day === 'Banked' ? 'Banked' : day;
    lines.push(label.padEnd(8) + '\t' + v.toFixed(2) + ' h');
  });
  if (data.noLunch) {
    lines.push('No-lunch: 0.50 h');
  }
  lines.push('');
  lines.push('Total: ' + (getTotalMinutes(data) / 60).toFixed(2) + ' h');
  if (data.fridayFinish) {
    var finishMins = timeToMinutes(data.fridayFinish);
    if (!isNaN(finishMins)) {
      var earliestMins = finishMins - getTotalMinutes(data);
      var earliest = minutesToTime(earliestMins);
      lines.push('');
      lines.push('Scheduled finish:\t' + data.fridayFinish);
      lines.push('Earliest finish:\t' + earliest);
      if (data.proposedFinish) {
        var pMins = timeToMinutes(data.proposedFinish);
        if (!isNaN(pMins)) {
          lines.push('Actual finish:\t\t' + data.proposedFinish);
          var diff = pMins - earliestMins;
          lines.push('Banked:\t\t' + (diff >= 0 ? '+' : '') + minutesToTime(Math.abs(diff)));
        }
      }
    }
  }
  lines.push('');
  lines.push('');
  lines.push('regards');
  lines.push('');
  lines.push('Royston');
  return lines;
}
