const flightPriceCheckerUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/' +
  'grioni.2%40osu.edu_dev/flights/flight-price-check.json';

export default function flightPriceAvgs(from, tos) {
  let tosParam = tos.join(',');

  return $.ajax({
    type: 'GET',
    url: flightPriceCheckerUrl,
    contentType: 'application/json; charset=utf-8',
    data: {
      "iataFrom": from,
      "iataTo": tosParam
    },
    dataType: 'json'
  });
}
