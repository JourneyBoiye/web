const DATE_FORMAT = 'YYYY-MM-DD';

function validateDates(startDate, endDate) {
  let startStr = startDate.val();
  let endStr = endDate.val();

  let start = moment(startStr, DATE_FORMAT);
  let end = moment(endStr, DATE_FORMAT);
  let now = moment();

  let msgs = [];
  if (start < now) {
    msgs.push('You can\'t leave in the past. Check start date.');
  }

  if (end < start) {
    msgs.push('Traveling for negative time, eh?. Check end date.');
  }

  return msgs;
};

export { validateDates };
