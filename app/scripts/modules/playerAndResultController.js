define([
	'application',
	'communicator'
],
function(App, Communicator) {
	App.module('PlayerAndResultController', function(PlayerAndResultController) {
		'use strict';

		PlayerAndResultController.startWithParent = true;

		PlayerAndResultController.players = [];

		PlayerAndResultController.addInitializer(function() {
			this.listenTo(Communicator.mediator, 'playerName:change:name:direct', this.onPlayerChangeName);
			this.listenTo(Communicator.mediator, 'playerMenu:switch:names', this.onPlayerSwitchName);
		});

		PlayerAndResultController.savePlayersToLocalStorage = function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.players = this.players;
			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};		

		PlayerAndResultController.savePlayer = function (player) {
			if(_.isEmpty(this.players)) {
				this.players = [];
				this.players.push(player);
			} else {
				var savedPlayer = _.findWhere(this.players, {isLeft: player.isLeft})
				if(_.isEmpty(savedPlayer)) {
					this.players.push(player);
				} else {
					savedPlayer.name = player.name;
				}
			}
			this.savePlayersToLocalStorage();

			App.module('MatchModule').savePlayerToMatch(this.players);
		},


		PlayerAndResultController.onPlayerChangeName = function(player) {
			this.savePlayer(player);
		};

		PlayerAndResultController.onPlayerSwitchName = function(playerLayout) {
			var player = [];

			var p1 = playerLayout.PlayerNameRegion.currentView;
			var p2 = playerLayout.otherPlayer.PlayerNameRegion.currentView;

			player.push(p1.getPlayer());
			player.push(p2.getPlayer());

			player[0].isLeft = !player[0].isLeft;
			player[1].isLeft = !player[1].isLeft;

			this.savePlayer(player[0]);
			this.savePlayer(player[1]);

			p1.setPlayer(player[1]);
			p2.setPlayer(player[0]);
		};

		PlayerAndResultController.getPlayerFromStorage =  function(isLeft) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore && !_.isEmpty(octopusStore.players)) {
				var player = _.findWhere(octopusStore.players, {
					isLeft: isLeft
				});
				this.savePlayer(player);
				return player;
			}
		};
	});
});
