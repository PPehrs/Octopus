define([
	'application',
	'communicator',
	'models/player'
],
function(App, Communicator, PlayerModel) {
	App.module('PlayerController', function(PlayerController) {
		'use strict';

		PlayerController.startWithParent = true;

		PlayerController.players = [];

		PlayerController.addInitializer(function() {
			this.listenTo(Communicator.mediator, 'playerName:change:name:direct', this.onPlayerChangeName);
			this.listenTo(Communicator.mediator, 'playerMenu:switch:names', this.onPlayerSwitchName);
		});

		PlayerController.savePlayersToLocalStorage = function() {
			App.module('MatchModule').savePlayerToMatch(this.players);

			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.players = this.players;
			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};

		PlayerController.removeOther = function () {
			debugger
			var userId = App.module('LoginModule').loggedInUserId();
			var playerSelf = _.findWhere(this.players, {fkUser: userId});
			this.players = [playerSelf];
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.players = this.players;
			localStorage.setItem('octopus', JSON.stringify(octopusStore));
			Communicator.mediator.trigger('start:match');
		},

		PlayerController.savePlayer = function (player, isOnGetFromStorage) {
			if(typeof player.isLeft === 'undefined') {
				return
			}
			if(_.isEmpty(this.players)) {
				this.players = [];
				this.players.push(player);
			} else {
				var savedPlayer = _.findWhere(this.players, {isLeft: player.isLeft})
				if(_.isEmpty(savedPlayer)) {
					this.players.push(player);
				} else {
					var pos = this.players.indexOf(savedPlayer);
					this.players[pos] = player;
				}
			}
			if(!isOnGetFromStorage) {
				this.savePlayersToLocalStorage();
			}
		},


		PlayerController.onPlayerChangeName = function(player) {
			this.savePlayer(player);
		};

		PlayerController.onSetPlayerNameOnlineAutomatic = function(playerLayout, data) {
			var p1View = playerLayout.PlayerNameRegion.currentView;
			var p2View = playerLayout.otherPlayer.PlayerNameRegion.currentView;

			var p1 = {
				legs: 0,
				name: data.nameFrom,
				fkUser: data.fkUserFrom,
				isLeft: true,
				isPlayerActive: true,
				uid: _.uniqueId('u_')
			}

			var p2 = {
				legs: 0,
				name: data.username,
				fkUser: data.fkUser,
				isLeft: false,
				isPlayerActive: false,
				uid: _.uniqueId('u_')
			}

			p1View.model = new PlayerModel(p1);
			p2View.model = new PlayerModel(p2);

			p1View.render();
			p2View.render();

			delete p1.isPlayerActive;
			delete p2.isPlayerActive;

			this.savePlayer(p1);
			this.savePlayer(p2);
		};

		PlayerController.onSetPlayerNameComputerAutomatic = function(playerLayout, comp) {
			var p1View = playerLayout.PlayerNameRegion.currentView;
			var p2View = playerLayout.otherPlayer.PlayerNameRegion.currentView;

			var lm = App.module('LoginModule');
			var p1 = {
				legs: 0,
				name: '',
				isLeft: true,
				isPlayerActive: true,
				uid: _.uniqueId('u_')
			}
			if(lm.isLoggedIn) {
				p1.name = lm.loggedInUserName();
				p1.fkUser = lm.loggedInUserId();
			}
			var p2 = {
				legs: 0,
				name: comp.name,
				comp: comp.comp,
				isLeft: false,
				isPlayerActive: false,
				uid: _.uniqueId('u_')
			}

			p1View.model = new PlayerModel(p1);
			p2View.model = new PlayerModel(p2);

			p1View.render();
			p2View.render();

			delete p1.isPlayerActive;
			delete p2.isPlayerActive;

			this.savePlayer(p1);
			this.savePlayer(p2);
		};

		PlayerController.onPlayerSwitchName = function(playerLayout) {
			var p1View = playerLayout.PlayerNameRegion.currentView
			var p2View = playerLayout.otherPlayer.PlayerNameRegion.currentView

			var p1 = p1View.model.toJSON();
			var p2 = p2View.model.toJSON();

			p1.isLeft = !p1.isLeft;
			p2.isLeft = !p2.isLeft;

			p1.isPlayerActive = !p1.isPlayerActive;
			p2.isPlayerActive = !p2.isPlayerActive;

			p1View.model = new PlayerModel(p2);
			p2View.model = new PlayerModel(p1);

			p1View.render();
			p2View.render();

			delete p1.isPlayerActive;
			delete p2.isPlayerActive;

			this.savePlayer(p1);
			this.savePlayer(p2);

		};

		PlayerController.unsetComp =  function(isLeft) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			var f = _.filter(octopusStore.players, function(w) {return w.comp > 0});
			if(!_.isEmpty(f)) {
				delete f[0].comp;
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			}
		},

		PlayerController.getPlayerFromStorage =  function(isLeft) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore && !_.isEmpty(octopusStore.players)) {
				var player = _.findWhere(octopusStore.players, {
					isLeft: isLeft
				});
				if(player) {
					this.savePlayer(player, true);
				}
				return player;
			}
		};
	});
});
