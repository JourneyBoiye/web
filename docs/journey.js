$(document).ready(function() {
  var queryResultsTemplate = Handlebars.compile($('#queries-template').html());

  var query = $('#query');
  var queryResults = $('#query-results');

  var testResults = [
    {
      'city': 'Buenos Aires',
      'country': 'Argentina',
      'content': 'A beautiful European flavored city in the heart of South America'
    }
  ];

  const context = {
    results: testResults
  };

  query.on('click', function() {
    queryResults.html(queryResultsTemplate(context));
    $("html, body").animate({ scrollTop: 0 }, 600);
  });
});
