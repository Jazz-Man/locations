var WP = require('wpapi');
var Base64 = require('js-base64').Base64;

var wp = new WP({
  endpoint: 'https://dev.upages.com.ua/wp-json',
  // username: 'jazzman',
  // password: 'jazzman.sv1'
  nonce:'2485b449b5'
});


// wp.posts().id( 547 ).delete();
wp.listings = wp.registerRoute('wp/v2','/listings/(?P<id>)',{
  // Listing any of these parameters will assign the built-in
  // chaining method that handles the parameter:
  params: [ 'before', 'after']
});


module.exports = wp;