import { countries } from 'country-data';

import { normalizer } from './js/country.js';
import * as validators from './js/validators.js';
import { getCountryFromAutocomplete } from './js/util.js';
import flightPriceAvgs from './js/flight-price-checker.js';

/**
 * Web application
 */
const HANDLEBARS_INTL_DATA = {
  locales: 'en-US'
};
HandlebarsIntl.registerWith(Handlebars);

const notifyLevel = Object.freeze({
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning',
  DANGER: 'danger'
});
const notify = (message, type) => {
  $.notify({
    message: message
  }, {
    type: type
  });
}

const apiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/kahn.128%40osu.edu_dev/suggestions/suggestion-provider.json';
const feedbackServiceEndpoint = 'https://openwhisk.ng.bluemix.net/api/v1/web/lan.74%40osu.edu_dev/feedback/feedback-service.json'
const journeyBoiye = {
  // add a single journeyBoiye entry
  add(activities) {
    console.log('Sending', activities)
    return $.ajax({
      type: 'POST',
      url: `${apiUrl}`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        activities,
      }),
      dataType: 'json',
    });
  },
  update(feedback, min_rpi, max_rpi, activities) {
    console.log('Sending', feedback);
    return $.ajax({
      type: 'POST',
      url: `${feedbackServiceEndpoint}`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        "feedback": feedback,
        "min_rpi": min_rpi,
        "max_rpi": max_rpi,
        "activities": activities
      }),
      dataType: 'json',
    })
  }
};

function countryAdvisory(tooltip, color) {
  let safe = '<span class="right" title="' + tooltip + '"><i class="fas fa-exclamation-circle" style="color:' + color + '"></i></span>';
  return new Handlebars.SafeString(safe);
}

Handlebars.registerHelper("flagLevel", function(level){
  if (level == 1) {
    return countryAdvisory('Level 1: Exercise normal precautions', 'green');
  } else if (level == 2) {
    return countryAdvisory('Level 2: Exercise increased cautions', 'orange');
  } else if (level == 3) {
    return countryAdvisory('Level 3: Reconsider travel', 'red');
  } else if (level == 4) {
    return countryAdvisory('Level 4: Do not travel', 'darkred');
  } else {
    return countryAdvisory('No travel advisories available', 'yellow');
  }
});


var min_rpi = 300;
var max_rpi = 0;

function countryNameToCode(name) {
  let code = '';
  for (let i = 0; i < countries.all.length; i++) {
    let country = countries.all[i];
    let norm = normalizer(country.name);

    if (norm === name.toLocaleLowerCase()) {
      code = country.alpha2;
      break;
    }
  }

  return code;
}

function runValidators(validators) {
  let msgs = [];
  for (let validator of validators) {
    let res = validator();
    msgs.push.apply(msgs, res);
  }

  return msgs;
}

function validateCountryInput(autocomplete, countryValid) {
  if (countryValid) {
    return validators.validateAutocomplete(autocomplete)
  }

  return ['Please enter location with autocomplete'];
}

(function() {
  // If type=date not available, use jQuery's datepicker instead.
  if ( $('[type="date"]').prop('type') != 'date' ) {
    $('[type="date"]').datepicker();
  }

  var cityInput = document.getElementById('city');
  var autocomplete = new google.maps.places.Autocomplete(cityInput,
     {types: ['(cities)']});

  let countryValid = false;
  $(cityInput).change(function() {
    countryValid = false;
  });
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    countryValid = true;
  });

  let errorsDisplay = $('#errors');
  let startDate = $('#start-date');
  let endDate = $('#end-date');
  let ageInput = $('#age');
  let budgetInput = $('#budget');

  const VALIDATORS = [
    () => validators.validateDates(startDate, endDate),
    () => validators.validateAge(ageInput, 5, 123),
    () => validators.validateBudget(budgetInput, 400),
    () => validateCountryInput(autocomplete, countryValid)
  ];

  let entriesTemplate;

  // intercept the click on the submit button, add the journeyboiye entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();
    
    $('#submitBtn').toggleClass("is-loading", true);

    let msgs = runValidators(VALIDATORS);
    if (msgs.length > 0) {
      for (let msg of msgs) {
        notify(msg, notifyLevel.DANGER);
      }

      $('#submitBtn').toggleClass("is-loading", false);
      return;
    }

    const country = Object.freeze(getCountryFromAutocomplete(autocomplete));
    let queryResults = $('#entries');

    journeyBoiye.add(
      $('#activities').val().trim()
    ).done(function(resp) {
      if (resp.resultsArray.length === 0) {
        queryResults.html(entriesTemplate(resp, {
          data: { intl: HANDLEBARS_INTL_DATA }
        }));

        $('#submitBtn').toggleClass("is-loading", false);
        $("html, body").animate({scrollTop: 0 }, 600);
      } else {
        min_rpi = resp.min_rpi;
        max_rpi = resp.max_rpi;

        let code = countryNameToCode(country);
        let iatas = resp.resultsArray.map(result => result.iata);

        flightPriceAvgs(code, iatas).then(function(avgsResp) {
          let avgs = avgsResp.avgs;

          let augmentedResults = resp.resultsArray.map(function(result, i) {
            let avg = avgs[i];
            result.fare = avg.avg;
            result.fareValid = avg.success && avg.size > 0;

            return result;
          });

          let context = {
            resultsArray: augmentedResults
          };

          queryResults.html(entriesTemplate(context, {
            data: { intl: HANDLEBARS_INTL_DATA }
          }));

          $('#submitBtn').toggleClass("is-loading", false);
          $("html, body").animate({scrollTop: 0 }, 600);
        });
      }
    }).error(error => {
      $('#submitBtn').toggleClass("is-loading", false);
      notify('There was an error fetching locations.', notifyLevel.DANGER);
    });
  });

  $(document).on('click', '#nlc', function() {
    $('#feedbackBtn').toggleClass("is-loading", true);
    
    var feedback_input = $('#feedback');
    if (feedback_input[0].checkValidity()){
      var queryResults = $('#entries');
      journeyBoiye.update(
        $('#feedback').val().trim(), min_rpi, max_rpi, $('#activities').val().trim()
      ).done(function(result) {
        // Only update the min/max rpi if we have new values from db
        if (result.docs.length != 0) {
          min_rpi = result.min_rpi;
          max_rpi = result.max_rpi;
          let country = getCountryFromAutocomplete(autocomplete);
          let code = countryNameToCode(country);
          let iatas = result.docs.map(result => result.iata);

          flightPriceAvgs(code, iatas).then(function(avgsResp) {
            let avgs = avgsResp.avgs;

            let augmentedResults = result.docs.map(function(result, i) {
              let avg = avgs[i];
              result.fare = avg.avg;
              result.fareValid = avg.success && avg.size > 0;

              return result;
            });

            let context = {
              resultsArray: augmentedResults
            };

            queryResults.html(entriesTemplate(context, {
              data: { intl: HANDLEBARS_INTL_DATA }
            }));

            $('#submitBtn').toggleClass("is-loading", false);
            $("html, body").animate({scrollTop: 0 }, 600);
          });
        } else {
          let context = {
            resultsArray: [] 
          };

          queryResults.html(entriesTemplate(context, {
            data: { intl: HANDLEBARS_INTL_DATA }
          }));

          $('#submitBtn').toggleClass("is-loading", false);
          $("html, body").animate({scrollTop: 0 }, 600);
        }
      }).error(error => {
        $('#feedbackBtn').toggleClass("is-loading", false);
        console.log(error);
        notify('There was an error updating results.', notifyLevel.DANGER);
      });

    } else {
      $('#feedbackBtn').toggleClass("is-loading", false);
      notify('Feedback for the result cannot be empty.', notifyLevel.DANGER);
      console.log("Invalid feedback input (empty)");
    }
  });

  $(document).ready(function() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  });
})();
