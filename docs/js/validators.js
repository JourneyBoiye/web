import { getCountryFromAutocomplete } from './util.js';

const DATE_PICKER_FORMAT = 'YYYY-MM-DD';

function validateDates(startDate, endDate) {
  let startStr = startDate.val();
  let endStr = endDate.val();

  let start = moment(startStr, DATE_PICKER_FORMAT);
  let end = moment(endStr, DATE_PICKER_FORMAT);
  let now = moment().startOf('day');

  let msgs = [];
  if (start < now) {
    msgs.push('You can\'t leave in the past. Check start date.');
  }

  if (end < start) {
    msgs.push('Leaving before you get there, ey? Check end date.');
  }

  return msgs;
}

function validateBudget(budgetInput, lower) {
  let budgetStr = budgetInput.val();

  let msgs = [];
  if (!/^\d+$/.test(budgetStr)) {
    msgs.push('Please only digits in budget. No decimals either!');
  }

  let budget = parseInt(budgetStr);
  if (budget < lower) {
    msgs.push('Being thrifty is a virtue. Unfortunately, JourneyBoiye cannot ' +
      'suggest locations if budget is below ' + lower + '.');
  }

  return msgs;
}

function validateAutocomplete(autocomplete) {
  let country = getCountryFromAutocomplete(autocomplete);

  let msgs = [];
  if (country === '') {
    msgs.push('Please enter your location with country with autocomplete.');
  }

  return msgs;
}

export { validateDates, validateAge, validateBudget, validateAutocomplete };
