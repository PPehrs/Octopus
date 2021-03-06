define([
	'application',
	'socket.io.client',
	'communicator'
],
function(App, SocketIo, Communicator) {
	App.module('SocketModule', function(SocketModule) {
		'use strict';

		SocketModule.startWithParent = true;
		SocketModule.socketIo = null;

		SocketModule.addInitializer(function() {
			var self = this;

			this.socketIo = SocketIo('http://85.214.219.136:3000');
			this.socketIo.on('connect', function(){
				console.log('socket connect');
				Communicator.mediator.trigger('APP:SOCKET:CONNECTED');
			});
			this.socketIo.on('event', function(data){
				Communicator.mediator.trigger('APP:SOCKET:EVENT', data);
			});
			this.socketIo.on('user-registered', function(data){
				Communicator.mediator.trigger('APP:SOCKET:USER-REGISTERED', data);
			});
			this.socketIo.on('check-battle-updated', function(data){
				Communicator.mediator.trigger('APP:SOCKET:CHECK_BATTLE-UPDATED', data);
			});
			this.socketIo.on('user-registered', function(data){
				Communicator.mediator.trigger('APP:SOCKET:USER-REGISTERED', data);
			});
			this.socketIo.on('match-updated', function(data){
				Communicator.mediator.trigger('APP:SOCKET:MATCH-UPDATED:' + data, data);
			});
			this.socketIo.on('encounter-updated', function(data){
				Communicator.mediator.trigger('APP:SOCKET:ENCOUNTER-UPDATED:' + data, data);
			});
			this.socketIo.on('user-logged-in', function(data){
				self.socketIo.on('challenge-request-' + data.fkUser, function(data){
					Communicator.mediator.trigger('CHALLENGE:REQUEST', data);
				});
				Communicator.mediator.trigger('APP:SOCKET:USER-LOGGED-IN', data);
			});
			this.socketIo.on('new-chat-message', function(data){
				var gc = localStorage.getItem('chat');
				if(gc) {
					gc = JSON.parse(gc);
					gc.push(data);
					if(gc.length > 50) {
						gc.shift();
					}
				} else {
					gc = [];
					gc.push(data);
				}
				localStorage.setItem('chat', JSON.stringify(gc));
				Communicator.mediator.trigger('APP:SOCKET:NEW-CHAT-MESSAGE', data);
			});
			this.socketIo.on('encounter-updated', function(data){
				Communicator.mediator.trigger('APP:SOCKET:ENCOUNTER-UPDATED', data);
				Communicator.mediator.trigger('APP:SOCKET:ENCOUNTER-UPDATED:' + data, data);
			});
			this.socketIo.on('SERVER-IS-ONLINE', function(data){
				console.log('SERVER-IS-ONLINE', data);
				Communicator.mediator.trigger('APP:SOCKET:SERVER-IS-ONLINE', data);
			});
			this.socketIo.on('error', function(data){
				console.log('socket error', data);
				Communicator.mediator.trigger('APP:SOCKET:ERROR', data);
			});
			this.socketIo.on('disconnect', function(){
				console.log('socket disconnect');
				Communicator.mediator.trigger('APP:SOCKET:DISCONNECTED');
			});

			this.listenTo(Communicator.mediator, 'APP:SOCKET:EMIT', this.emit);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:SEND', this.send);
		});

		SocketModule.addFinalizer(function() {
			if(this.socketIo && this.socketIo.connected) {
				this.socketIo.disconnect();
			}
		});

		SocketModule.emit = function (event, data, callback) {
			if (this.socketIo.disconnected) {
				Communicator.mediator.trigger('APP:SOCKET:DISCONNECTED');
				return;
			};

			this.socketIo.emit(event, data, function(response) {
				callback(response);
			});
		},

		SocketModule.send = function (event, data) {
			if (this.socketIo.disconnected) {
				Communicator.mediator.trigger('APP:SOCKET:DISCONNECTED');
				return;
			};

			this.socketIo.send(event, data, function(response) {
				callback(response);
			});
		},

		//THE API ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

		SocketModule.SetCheckBattleScore = function (data, callback, self) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('set-check-battle-score', data);
		},

		SocketModule.ChallangeRequest = function (data) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.on('challenge-refuse-' + data.uid, function(data){
				Communicator.mediator.trigger('CHALLENGE:REFUSE', data);
			});
			socketIo.on('challenge-accept-' + data.uid, function(data){
				Communicator.mediator.trigger('CHALLENGE:ACCEPT', data);
			});
			socketIo.on('online-match-' + data.uid, function(data){
				Communicator.mediator.trigger('ONLINE:MATCH:START', data);
			});
			socketIo.on('new-chat-message-' + data.uid, function(data){
				Communicator.mediator.trigger('APP:SOCKET:PRIVATE-CHAT-MESSAGE', data);
			});
			socketIo.on('online-match-updated-' + data.fkUser, function (data) {
				App.module('OnlineController').newScore(data);
			});
			socketIo.on('challenge-canceled-' + data.uid + '-' + App.module('LoginModule').loggedInUserId(), function () {
				Communicator.mediator.trigger('ONLINE:MATCH:CANCELED');
			});
			socketIo.emit('send-challenge-request', data);
		},

		SocketModule.ChallengeRefuse = function (data) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('challenge-refuse', data);
		},

		SocketModule.ChallengeCanceled = function (data) {
			var socketIo = App.module('SocketModule').socketIo;
			data.fkUserSendCanceled = data.fkUser;
			if(data.fkUserSendCanceled === App.module('LoginModule').loggedInUserId()) {
				data.fkUserSendCanceled = data.fkUserFrom;
			}
			socketIo.emit('challenge-canceled', data);
		},

		SocketModule.ChallengeAccept = function (data) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.on('online-match-updated-' + data.fkUserFrom, function (data) {
				App.module('OnlineController').newScore(data);
			});
			socketIo.on('challenge-canceled-' + data.uid + '-' + App.module('LoginModule').loggedInUserId(), function () {
				Communicator.mediator.trigger('ONLINE:MATCH:CANCELED');
			});
			socketIo.on('new-chat-message-' + data.uid, function(data){
				Communicator.mediator.trigger('APP:SOCKET:PRIVATE-CHAT-MESSAGE', data);
			});
			socketIo.on('online-match-' + data.uid, function(data){
				Communicator.mediator.trigger('ONLINE:MATCH:START', data);
			});
			socketIo.emit('challenge-accept', data);
		},

		SocketModule.GetCheckBattleHighscore = function (data, callback, self) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('get-check-battle-highscore', data, function (data) {
				callback(data, self);
			});
		},

		SocketModule.GetPlayerMatches = function (callback, self) {
			var data = {
				fkUser: App.module('LoginModule').loggedInUserId()
			};

			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('get-player-matches', data, function (data) {
				callback(data, self);
			});
		},

		SocketModule.RegisterUser = function (model, callback, self) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('register-user', model.attributes, function (data) {
				callback(data, self);
			});
		},

		SocketModule.ReLoginUser = function (lData) {
			if(lData && lData.id) {
				var socketIo = App.module('SocketModule').socketIo;
				socketIo.emit('re-login-user', lData, function (data) {
					Communicator.mediator.trigger('DialogModule:LOGGED-IN', data);
				});
			}
		};

		SocketModule.LogOutUser = function (lData) {
			var dmO = localStorage.getItem('dm-o');
			if (dmO) {
				var id = JSON.parse(dmO).id
				var socketIo = App.module('SocketModule').socketIo;
				socketIo.emit('log-out-user', JSON.parse(dmO).id, function () {
					Communicator.mediator.trigger('DialogModule:LOGGED-OUT');
				});
			}
		};

		SocketModule.UploadAvatar = function (lData, callback, self) {
			var data = {
				fkUser: App.module('LoginModule').loggedInUserId(),
				avatar: lData.get('avatar')
			};

			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('upload-player-avatar', data, function (data) {
				callback(data, self);
			});
		};

		SocketModule.LoadAvatar = function (callback, self) {
			var data = {
				fkUser: App.module('LoginModule').loggedInUserId()
			};
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('get-player-avatar', data, function (data) {
				callback(data, self);
			});
		};

		SocketModule.CheckPw = function (model, callback, self) {
			var o = model.toJSON();
			var socketIo = App.module('SocketModule').socketIo;
			if(o._id) {
				socketIo.emit('check-pw', o, function (data) {
					callback(data, self);
				});
			} else {
				callback(o, self);
			}
		},


		SocketModule.LoginUser = function (model, callback, self) {
			var o = model.toJSON();
			if((!o.username || !o.pw) && o.email) {
				var socketIo = App.module('SocketModule').socketIo;
				socketIo.emit('send-pw', o.email, function (data) {
					callback(data, self);
				});
			} else if (o.username && o.pw) {
				var socketIo = App.module('SocketModule').socketIo;
				socketIo.emit('login-user', {username: o.username, pw: o.pw}, function (data) {
					callback(data, self);
				});
			} else {
				var err = {
					error: 'MISSING_FIELDS'
				}
				callback(err, self);
			}
		},

		SocketModule.NewTeam = function (model, callback, self) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('update-or-create-team', model.attributes, function (data) {
				//callback(data, self);
			});
			callback(null, self);
		},

		SocketModule.DoCallbackDummy = function (model, callback, self) {
			if(callback) {
				callback(null, self);
			}
		},

		SocketModule.UpdateOrCreateEncounter = function (model, callback, self) {
			var socketIo = App.module('SocketModule').socketIo;
			socketIo.emit('update-or-create-encounter', model.attributes, function (data) {
				//callback(data, self);
			});

			if(callback) {
				callback(null, self);
			}
		},

		SocketModule.SendChatMessage = function (data, callback) {
			this.emit('send-chat-message', data, callback);
		},

		SocketModule.SendChatMessageTo = function (data, callback) {
			this.emit('send-chat-message-to', data, callback);
		},

		SocketModule.GetTeams = function (callback) {
			this.emit('get-teams', null, callback);
		},

		SocketModule.GetLiveMatches = function (callback) {
			this.emit('get-live-matches', null, callback);
		},

		SocketModule.GetLiveEncounters = function (callback) {
			this.emit('get-live-encounters', null, callback);
		},

		SocketModule.GetEncounterMatches = function (data, callback) {
			this.emit('get-encounter-matches', data, callback);
		},

		SocketModule.GetMatch = function (uid, callback) {
			this.emit('get-match', {uid:uid}, callback);
		},

		SocketModule.GetEncounter = function (fkEncounter, callback) {
			this.emit('get-encounter', fkEncounter, callback);
		},

		SocketModule.GetRegisteredUser = function (callback) {
			this.emit('get-registered-users', null, callback);
		},

		SocketModule.GetLoggedInUser = function (callback) {
				this.emit('get-logged-in-users', null, callback);
		},

		SocketModule.OnlineInformation = function () {
			var self = this;
			setTimeout(function() {
				console.log('send online-information to server');
				this.emit('online-information', {id: 'IM ONLINE'});
				self.OnlineInformation();
			}, 10000);
		};
	});
});
