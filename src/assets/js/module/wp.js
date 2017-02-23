var WP = require('wpapi');

var wp = new WP({
  endpoint: 'http://dev.upages.com.ua/wp-json'
});
wp.listings = wp.registerRoute('wp/v2','/listings/(?P<id>)',{
  // Listing any of these parameters will assign the built-in
  // chaining method that handles the parameter:
  params: [ 'before', 'after']
});


module.exports = wp;