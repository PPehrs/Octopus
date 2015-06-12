define([
	'application'
],
function(App) {
	App.module('MatchModule', function(MatchModule) {
		'use strict';

		MatchModule.started = false;

		MatchModule.matchStatus = {};

		MatchModule.startWithParent = false;

		MatchModule.addInitializer(function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			if(_.isEmpty(octopusStore) || !octopusStore.match || _.isEmpty(octopusStore.match)) {
				octopusStore = {};
				var matchUuid = octopus.uuid.v4();

				this.matchStatus = {
					uuid: matchUuid,
					playerLeftStartsLeg: true,
					playerLeftStartsSet: true,
					playerLeftStartsMatch: true,
					isPlayerLeftActive: true
				};

				_.extend(octopusStore, {match: {state: this.matchStatus}});
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			} else {
				console.log('heavy load - load match from store');
				this.matchStatus = octopusStore.match.state;
			}

			this.started = true;
		});

		MatchModule.addFinalizer(function() {
			this.deleteMatchFromLocalStorage();
			this.started = false;
		});

		MatchModule.deleteMatchFromLocalStorage = function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore.match) {
				octopusStore.match = {};
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			}
		};
	});
});
