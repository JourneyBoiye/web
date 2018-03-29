Handlebars.registerHelper('link', function(text, url, options) {
  url = Handlebars.escapeExpression(url);
  text = Handlebars.escapeExpression(text);

  let attrs = [];
  for (let prop in options.hash) {
    attrs.push(Handlebars.escapeExpression(prop) + '="' +
      Handlebars.escapeExpression(options.hash[prop]) + '"');
  }

  return new Handlebars.SafeString(
    '<a ' + attrs.join(' ') + "href='" + url + "'>" + text + '</a>');
});

Handlebars.registerHelper('wiki_link', function(title) {
  return new Handlebars.SafeString(wikipedia_url_from_title(title));
});

function wikipedia_url_from_title(title) {
  let underscored = title.replace(/ /g, '_');

  return 'https://en.wikivoyage.org/wiki/' + underscored;
}
