define([
	'application',
	'bootbox',
	'tooltipster',
	'communicator',

	'../views/item/board/dialogRegister',
	'../views/item/board/dialogLogin'
],
function(App, Bootbox, Tooltip, Communicator, DialogRegister, DialogLogin) {
	App.module('LoginModule', function(LoginModule) {
		'use strict';

		LoginModule.addInitializer(function() {
			this.listenTo(Communicator.mediator, 'DialogModule:LOGGED-IN', LoginModule.onLoggedIn);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._onConnected);
		});

		LoginModule._onConnected = function () {
			var dmO = localStorage.getItem('dm-o');
			if(dmO) {
				App.module('SocketModule').ReLoginUser(JSON.parse(dmO));
			}
		};

		LoginModule.onLoggedIn = function (res) {
			localStorage.setItem('dm-o', JSON.stringify(res.data));
		};

		LoginModule.isLoggedIn = function () {
			var dmO = localStorage.getItem('dm-o');
			if(dmO && dmO != 'null') {
				if(JSON.parse(dmO).id) {
					return true;
				}
			}
			return false;
		};

		LoginModule.loggedInUserId = function () {
			var dmO = localStorage.getItem('dm-o');
			if(dmO && dmO != 'null') {
				return JSON.parse(dmO).userId;
			}
		};

		LoginModule.loggedInUserName = function () {
			var dmO = localStorage.getItem('dm-o');
			if(dmO && dmO != 'null') {
				return JSON.parse(dmO).username;
			}
		};

		LoginModule.logout = function () {
			localStorage.setItem('dm-o', null);
		};

		LoginModule.login = function () {
			App.module('DialogModule').showConfirm('Anmelden', DialogLogin, 'LoginUser');
		};

		LoginModule.register = function () {
			App.module('DialogModule').showConfirm('Registrieren', DialogRegister, 'RegisterUser');
		};

	});
});
