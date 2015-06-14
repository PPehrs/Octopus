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
				console.log('socket event', data);
				Communicator.mediator.trigger('APP:SOCKET:EVENT', data);
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

		SocketModule.emit = function (event, data) {
			if (this.socketIo.disconnected) {
				Communicator.mediator.trigger('APP:SOCKET:DISCONNECTED');
				return;
			};

			this.socketIo.send(event, data, function(response) {
				console.log(event, response);
			});
		},

		SocketModule.send = function (event, data) {
			if (this.socketIo.disconnected) {
				Communicator.mediator.trigger('APP:SOCKET:DISCONNECTED');
				return;
			};

			this.socketIo.send(event, data, function(response) {
				console.log(event, response);
			});
		},

		SocketModule.OnlineInformation = function () {
			var self = this;
			setTimeout(function() {
				console.log('send online-information to server');
				self.emit('online-information', {id: 'IM ONLINE'});
				self.OnlineInformation();
			}, 10000);
		};
	});
});
