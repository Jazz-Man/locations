const $$ = require('domtastic');

const loginForm = $$('#login-form');
if (loginForm.length) {
	
	require.ensure([], function (require) {
		const Base64 = require('js-base64').Base64;
		const RestClient = require('./rest-client');
		const jwt = new RestClient('http://dev.upages.com.ua/wp-json/jwt-auth/v1');
		const test = new RestClient('http://dev.upages.com.ua/wp-json/wp/v2/users/me');
//		test;
		jwt.res('token');

		const signInBtn = loginForm.find('#sign-in');

		signInBtn.on('click', function (e) {
			e.preventDefault();
			const username = loginForm.find('#username');
			const password = loginForm.find('#password');

			jwt.token.post({
				username: Base64.encode(username.val()),
				password: Base64.encode(password.val())
			}).then(function (res) {
				console.log(res);
				localStorage.setItem('token', res.token);
				
			}).catch(function (e) {
				console.error( 'Error', e );
			});
			
			test.get().then(function (res) {
				console.log(res);
				
			}).catch(function (e) {
				console.error( 'Error', e );
			});
			
		});
	});
}