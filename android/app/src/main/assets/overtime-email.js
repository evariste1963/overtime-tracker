window.EmailConfig = {
  defaultTo: 'annette.bate@dncompany.com',
  defaultCc: 'neill.yates@dncompany.com',
  subjectPrefix: 'Overtime Summary',
  recipientName: 'Annette',
  senderName: 'Royston',
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
  var sep = '  --------------------------------------------------';
  var totalH = (getTotalMinutes(data) / 60).toFixed(2);
  var lastWn = wn === 1 ? 52 : wn - 1;

  lines.push('');
  lines.push(EmailConfig.recipientName + ',');
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
  lines.push(EmailConfig.senderName);
  lines.push('*pp. royston.allfrey@dncompany.com*');
  lines.push('');
  return lines;
}
