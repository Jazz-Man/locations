var $$ = require('domtastic');

var loginForm = $$('#login-form');
if (loginForm.length) {
	
	require.ensure([], function (require) {
		var Base64 = require('js-base64').Base64;
		var RestClient = require('./rest-client');
		var jwt = new RestClient('http://dev.upages.com.ua/wp-json/jwt-auth/v1');
		jwt.res('token');
		
		var signInBtn = loginForm.find('#sign-in');
		
		signInBtn.on('click', function (e) {
			e.preventDefault();
			var username = loginForm.find('#username');
			var password = loginForm.find('#password');
			
			jwt.token.post({
				username: Base64.encode(username.val()),
				password: Base64.encode(password.val())
			}).then(function (res) {
				console.log(res);
				localStorage.setItem('token', res.token);
				
			}).catch(function (e) {
				console.error( 'Error', e );
			});
			
		});
	});
}