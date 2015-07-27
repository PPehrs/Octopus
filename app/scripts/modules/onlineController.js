define([
	'application',
	'communicator'
],
function(App, Communicator) {
	App.module('OnlineController', function(OnlineController) {
		'use strict';
		OnlineController.startWithParent = true;

		OnlineController.addInitializer(function() {
			OnlineController.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', OnlineController.reconnected);
		});

		OnlineController.reconnected = function () {
			var om = localStorage.getItem('om');
			if(!_.isEmpty(om)) {
				var onlineMatch = JSON.parse(om);
				var listenTo = onlineMatch.fkUser;
				if(App.module('LoginModule').loggedInUserId() === onlineMatch.fkUser) {
					listenTo = onlineMatch.fkUserFrom
				}
				var socketIo = App.module('SocketModule').socketIo;
				socketIo.on('online-match-updated-' + listenTo, function (data) {
					App.module('OnlineController').newScore(data);
				});
				socketIo.on('new-chat-message-' + onlineMatch.uid, function(data){
					Communicator.mediator.trigger('APP:SOCKET:PRIVATE-CHAT-MESSAGE', data);
				});
			}
		};

		OnlineController.save = function (data) {
			localStorage.setItem('om', JSON.stringify(data));
		};

		OnlineController.get = function (data) {
			var om =  localStorage.getItem('om');
			if(om) {
				return JSON.parse(om);
			} else {
				return null;
			}
		};

		OnlineController.newScore = function (match) {
			var mm = App.module('MatchModule');
			mm.match = match;
			mm.saveMatchToLocalStorage();
			mm.reloadMatch();
		};
	});
});
