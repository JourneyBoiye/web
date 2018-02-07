$(document).ready(function() {
  var queryResultsTemplate = Handlebars.compile($('#queries-template').html());

  var query = $('#query');
  var queryResults = $('#query-results');

  var testQueries = [
    {
      'city': 'Buenos Aires',
      'country': 'Argentina',
      'content': 'A beautiful European flavored city in the heart of South America'
    }
  ];

  const context = {
    queries: testQueries
  };

  query.on('click', function() {
    queryResults.html(queryResultsTemplate(context));
  });
});
