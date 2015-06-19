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
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.players = this.players;
			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};

		PlayerController.savePlayer = function (player, isOnGetFromStorage) {
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
				App.module('MatchModule').savePlayerToMatch(this.players);
			}
		},


		PlayerController.onPlayerChangeName = function(player) {
			this.savePlayer(player);
		};

		PlayerController.onPlayerSwitchName = function(playerLayout) {
			var p1View = playerLayout.PlayerNameRegion.currentView
			var p2View = playerLayout.otherPlayer.PlayerNameRegion.currentView

			var p1 = p1View.model.toJSON();
			var p2 = p2View.model.toJSON();

			p1.isLeft = !p1.isLeft;
			p2.isLeft = !p2.isLeft;

			p1View.model = new PlayerModel(p2);
			p2View.model = new PlayerModel(p1);

			p1View.render();
			p2View.render();

			delete p1.isPlayerActive;
			delete p2.isPlayerActive;

			this.savePlayer(p1);
			this.savePlayer(p2);

		};

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
