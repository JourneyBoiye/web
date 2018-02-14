/**
 * Web application
 */
const apiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/kahn.128%40osu.edu_dev/suggestions/suggestion-provider-sequence.json';
const guestbook = {
  // add a single guestbood entry
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
  }
};

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // intercept the click on the submit button, add the guestbook entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    var queryResults = $('#entries');
    guestbook.add(
      $('#activities').val().trim()
    ).done(function(result) {
      queryResults.html(entriesTemplate(result))
      $("html, body").animate({scrollTop: 0 }, 600)
    }).error(function(error) {
      // Included for demo purposes
      var testQueries = [
        {
          'name': 'Buenos Aires',
          'country': 'Argentina',
          'comment': 'A beautiful European flavored city in the heart of South America'
        }
      ];

      const dummy = {
        results: testQueries
      };
      queryResults.html(entriesTemplate(dummy))
      console.log(error);
    });
  });

  $(document).ready(function() {
    prepareTemplates();
  });
})();

