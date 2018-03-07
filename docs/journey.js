/**
 * Web application
 */
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
        "max_rpi": max_rpi
        "activities": activities
      }),
      dataType: 'json',
    })
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
    journeyBoiye.add(
      $('#activities').val().trim()
    ).done(function(result) {
      console.log(result);
      min_rpi = result.min_rpi
      max_rpi = result.max_rpi
      queryResults.html(entriesTemplate(result))
      $("html, body").animate({scrollTop: 0 }, 600)
    }).error(function(error) {
      console.log(error);
    });
  });

  $(document).on('click', '#nlc', function() {

    var queryResults = $('#entries');
    journeyBoiye.update(
      $('#purpose').val().trim(), min_rpi, max_rpi, $('#activities').val().trim()
    ).done(function(result) {
      console.log(result)
      result.resultsArray = result.docs.slice(0,6) // rly gud code don't look into it
      queryResults.html(entriesTemplate(result))
      $("html, body").animate({scrollTop: 0 }, 600)
    }).error(function(error) {
      console.log(error)
    });
  });

  $(document).ready(function() {
    prepareTemplates();
  });
})();

