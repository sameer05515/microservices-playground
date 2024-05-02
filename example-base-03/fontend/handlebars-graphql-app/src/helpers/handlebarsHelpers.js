const handlebars = require('handlebars');

// Registering a custom Handlebars helper to stringify objects
handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

module.exports = handlebars;
