/**
 * Web application
 */
const apiUrl = 'https://openwhisk.ng.bluemix.net/api/v1/web/kahn.128%40osu.edu_dev/suggestions/suggestion-provider.json';
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

(function() {

  let entriesTemplate;

  function prepareTemplates() {
    entriesTemplate = Handlebars.compile($('#entries-template').html());
  }

  // intercept the click on the submit button, add the journeyBoiye entry and
  // reload entries on success
  $(document).on('submit', '#addEntry', function(e) {
    e.preventDefault();

    var queryResults = $('#entries');
    var dummyQueries =  // for test
        {
          'results':[
          {
            'name': 'Buenos Aires',
            'country': 'Argentina',
            'region': 'South America',
            'text': 'A beautiful European flavored city in the heart of South America',
            'level': 1
          },
          {
            'name': 'Columbus',
            'country': 'United States',
            'region': 'North America',
            'text': 'A beautiful European flavored city in the heart of South America',
            'level': 2
          },
          {
            'name': 'Tianjin',
            'country': 'China',
            'region': 'Asia',
            'text': 'A beautiful European flavored city in the heart of South America',
            'level': 3
          },
          {
            'name': 'Pairs',
            'country': 'France',
            'region': 'Europe',
            'text': 'A beautiful European flavored city in the heart of South America',
            'level': 4
          },
          {
            'name': 'Columbus',
            'country': 'United States',
            'region': 'North America',
            'text': 'A beautiful European flavored city in the heart of South America',
            'level': ''
          }]
        };
    journeyBoiye.add(
      $('#activities').val().trim()
    ).done(function(result) {
      console.log(result);
      queryResults.html(entriesTemplate(result)) // use dummyQueries for test
      $("html, body").animate({scrollTop: 0 }, 600)
    }).error(function(error) {
      // Included for demo purposes
      var testQueries = [
        {
          'name': 'Buenos Aires',
          'country': 'Argentina',
          'region': 'South America',
          'text': 'A beautiful European flavored city in the heart of South America',
          'level': 1
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

