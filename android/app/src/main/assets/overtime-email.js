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

  lines.push('');
  lines.push('====================================================');
  lines.push('          OVERTIME SUMMARY \u2014 Week ' + wn);
  lines.push('====================================================');
  lines.push('');
  lines.push(EmailConfig.recipientName + ',');
  lines.push('');
  lines.push('Here is the summary of my extra hours this week:');
  lines.push('');
  lines.push(sep);

  var days = ['Banked', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  if (data.noLunch) days.push('Forgone lunch');

  days.forEach(function (day) {
    var v = day === 'Forgone lunch' ? 0.5 : (parseFloat(data.hours[day] || 0) || 0);
    lines.push('    ' + day.padEnd(14) + ' \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7   ' + v.toFixed(2) + ' h');
  });

  lines.push(sep);
  lines.push('    ' + 'Total'.padEnd(14) + ' \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7   ' + totalH + ' h');
  lines.push(sep);
  lines.push('');

  if (data.fridayFinish) {
    var finishMins = timeToMinutes(data.fridayFinish);
    if (!isNaN(finishMins)) {
      var earliestMins = finishMins - getTotalMinutes(data);
      var earliest = minutesToTime(earliestMins);
      lines.push(sep);
      lines.push('    Scheduled finish \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7   ' + data.fridayFinish);
      lines.push('    Earliest finish \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7   ' + earliest);
      if (data.proposedFinish) {
        var pMins = timeToMinutes(data.proposedFinish);
        if (!isNaN(pMins)) {
          lines.push('');
          lines.push('    ACTUAL FINISH \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7   ' + data.proposedFinish);
          lines.push('');
          var diff = (pMins - earliestMins) / 60;
          lines.push('    Banked \u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7\u00b7   ' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + ' h');
        }
      }
      lines.push(sep);
    }
  }

  lines.push('');
  lines.push('Regards,');
  lines.push(EmailConfig.senderName);
  lines.push('');
  return lines;
}
