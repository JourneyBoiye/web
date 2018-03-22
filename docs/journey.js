import { countries } from 'country-data';
import { normalizer } from './js/country.js';
import * as domlist from './js/domlist.js';


/**
 * Web application
 */
const HANDLEBARS_INTL_DATA = {
  locales: 'en-US'
};
HandlebarsIntl.registerWith(Handlebars);

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

const flightPriceCheckerUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/grioni.2%40osu.edu_dev/flights/flight-price-check.json';
const flightPriceChecker = {
  avg(from, to) {
    return $.ajax({
      type: 'GET',
      url: flightPriceCheckerUrl,
      contentType: 'application/json; charset=utf-8',
      data: {
        "iataFrom": from,
        "iataTo": to
      },
      dataType: 'json'
    });
  }
};

Handlebars.registerHelper("flagLevel", function(level){
  if (level == 1){
    return new Handlebars.SafeString("<span title=\"level 1: Excercise normal precautions\"><i class=\"fas fa-exclamation-circle\" style=\"color:green\"></i></span>");
  }
  else if (level == 2){
    return new Handlebars.SafeString("<span title=\"level 2: Excercise increased cautions\"><i class=\"fas fa-exclamation-circle\" style=\"color:orange\"></i></span>");
  }
  else if (level == 3){
    return new Handlebars.SafeString("<span title=\"level 3: Reconsider travel\"><i class=\"fas fa-exclamation-circle\" style=\"color:red\"></i></span>");
  }
  else if (level == 4){
    return new Handlebars.SafeString("<span title=\"level 4: Do not travel\"><i class=\"fas fa-exclamation-circle\" style=\"color:darkred\"></i></span>");
  }
  else{
    return new Handlebars.SafeString("<span title=\"No travel advisories available\"><i class=\"fas fa-question-circle\" style=\"color:yellow\"></i></span>");
  }
});

var min_rpi = 300;
var max_rpi = 0;
function getCountryFromAutocomplete(autocomplete) {
  let place = autocomplete.getPlace();
  let country = '';

  if (place !== undefined && place !== null) {
    let lastIndex = place.address_components.length - 1;
    let lastComponent = place.address_components[lastIndex]

    for (let i = 0; i < lastComponent.types.length; i++) {
      let type = lastComponent.types[i];
      if (type === 'country') {
        country = lastComponent.long_name;
        break;
      }
    }
  }

  return country;
}

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

(function() {
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
  let entriesTemplate;

  // intercept the click on the submit button, add the journeyboiye entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    domlist.clear(errorsDisplay);

    var queryResults = $('#entries');
    journeyBoiye.add(
      $('#activities').val().trim()
    ).done(function(resp) {
      min_rpi = resp.min_rpi;
      max_rpi = resp.max_rpi;

      let country = getCountryFromAutocomplete(autocomplete);

      if (countryValid && country !== '') {
        let code = countryNameToCode(country);

        const promises = resp.resultsArray.map(function(result) {
          return flightPriceChecker.avg(code, result.iata).then(function(resp) {
            result.fare = resp.avg;
            result.fareValid = resp.success;

            return result;
          });
        });

        Promise.all(promises).then(function(results) {
          console.log(results);
          let context = {
            resultsArray: results
          };

          queryResults.html(entriesTemplate(context, {
            data: { intl: HANDLEBARS_INTL_DATA }
          }));
          $("html, body").animate({scrollTop: 0 }, 600);
        });
      } else {
        domlist.add(errorsDisplay, 'The country must be filled in with autocomplete.');
      }
    }).error(function(error) {
      console.log(error);
      domlist.add(errorsDisplay, 'There was an error fetching locations.');
    });
  });

  $(document).on('click', '#nlc', function() {
    domlist.clear(errorsDisplay);

    var queryResults = $('#entries');
    journeyBoiye.update(
      $('#feedback').val().trim(), min_rpi, max_rpi, $('#activities').val().trim()
    ).done(function(result) {
      console.log(result)
      result.resultsArray = result.docs
      let country = getCountryFromAutocomplete(autocomplete);
      let code = countryNameToCode(country);

      const promises = result.resultsArray.map(function(result) {
        return flightPriceChecker.avg(code, result.iata).then(function(resp) {
          result.fare = resp.avg;
          result.fareValid = resp.success;

          return result;
        });
      });

      Promise.all(promises).then(function(results) {
        console.log(results);
        let context = {
          resultsArray: results
        };

        queryResults.html(entriesTemplate(context, {
          data: { intl: HANDLEBARS_INTL_DATA }
        }));
        $("html, body").animate({scrollTop: 0 }, 600);
      });
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).ready(function() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  });
})();
