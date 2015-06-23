define([
	'application',
	'communicator',
	'models/player'
],
function(App, Communicator, PlayerModel) {
	App.module('EncounterController', function(EncounterController) {
		'use strict';

		EncounterController.startWithParent = true;

		EncounterController.check = function (match) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(!_.isEmpty(octopusStore.activeEncounterMatch)) {
				if (octopusStore.activeEncounterMatch.uid === match.uid) {

					var won = App.module('MatchModule').wonLegs();
					var players = _.clone(App.module('PlayerController').players);

					var encounterMatch = _.findWhere(octopusStore.encounterMatches, {uid:octopusStore.activeEncounterMatch.uid});
					octopusStore.encounterMatches = _.without(octopusStore.encounterMatches, encounterMatch);
					_.each(players, function (player) {
						var wonLegs = player.isLeft?won.left.legs:won.right.legs;
						player.legs = wonLegs;

						if(player.fkTeamPlayer === encounterMatch.player1.fkTeamPlayer) {
							encounterMatch.player1.legs = wonLegs;
						} else if(player.fkTeamPlayer === encounterMatch.player2.fkTeamPlayer) {
							encounterMatch.player2.legs = wonLegs;
						}
					});
					octopusStore.encounterMatches.push(encounterMatch);
					localStorage.setItem('octopus', JSON.stringify(octopusStore));

					App.module('PlayerController').savePlayer(players[0]);
					App.module('PlayerController').savePlayer(players[1]);

					return {
						p1Legs: encounterMatch.player1.legs,
						p2Legs: encounterMatch.player2.legs
					};
				}
			}
		};

		EncounterController.add = function (match) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			if(_.isEmpty(octopusStore.encounterMatches)) {
				octopusStore.encounterMatches = [];
			}
			octopusStore.encounterMatches.push({
				uid: match.uid,
				player1: match.p1,
				player2: match.p2
			});

			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};

		EncounterController.delete = function (match) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			if(_.isEmpty(octopusStore.encounterMatches)) {
				octopusStore.encounterMatches = [];
			}

			var m = _.findWhere(octopusStore.encounterMatches, {uid: match.uid});
			octopusStore.encounterMatches = _.without(octopusStore.encounterMatches, m);

			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};

	});
});
