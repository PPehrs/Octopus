define([
	'application'
],
function(App) {
	App.module('MatchModule', function(MatchModule) {
		'use strict';

		MatchModule.started = false;
		MatchModule.match = {};

		MatchModule.startWithParent = false;

		MatchModule.isUndoPossible = function() {
			return (this.started &&
				!_.isEmpty(this.match) &&
				this.match.started);
		};

		MatchModule.undoLast = function() {
			if(this.isUndoPossible()) {
				//first check active leg
				if(this.match.activeLeg && this.match.activeLeg.entries.length > 0) {
					var entry = _.last(this.match.activeLeg.entries);
					return entry;
				}
			}
		};		

		MatchModule.deleteLastScore = function(isLeftActive) {
			this.match.activeLeg.entries.pop();			
			this.saveMatchToLocalStorage();
			this.match.state.isPlayerLeftActive = isLeftActive;	
		};				

		MatchModule.addInitializer(function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			if(!octopusStore.match || _.isEmpty(octopusStore.match)) {

				var matchUid = octopus.uuid();

				var matchStatus = {
					playerLeftStartsLeg: true,
					playerLeftStartsSet: true,
					isPlayerLeftActive: true
				};

				this.match = {
					uid: matchUid,
					startDateTime: Date.now(),
					set: 0,
					leg: 0,
					state: matchStatus,
					started: false
				}

				_.extend(octopusStore, {match: this.match});
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			} else {
				console.log('heavy load - load match from store');
				this.match = octopusStore.match;
			}
			this.started = true;

			//===> fire new match
		});

		MatchModule.addFinalizer(function() {
			this.match = {};
			this.deleteMatchFromLocalStorage();
			this.started = false;

			//===> fire match done
		});

		MatchModule.deleteMatchFromLocalStorage = function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore.match) {
				octopusStore.match = {};
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			}
		};

		MatchModule.saveMatchToLocalStorage = function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.match = this.match;
			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};

		//----------------------------------------------------------------------

		MatchModule.newScore = function(value, check, checkVal, isLeftActive, uid) {
			if(!this.match.started) {
				this.match.started = true;
				this.match.activeLeg = {
					uid: _.uniqueId('l_'),
					startDateTime: Date.now(),
					entries: []
				}
			}

			var entry = {
				value: value,
				uid: uid
			};

			if(!this.match.activeLeg.entries.length) {
				_.extend(entry, {
					isLeft: !isLeftActive
				});
			}

			if(check) {
				_.extend(entry, {
					check: check,
					checkVal: checkVal
				});
			}

			this.match.activeLeg.entries.push(entry);
			this.match.state.isPlayerLeftActive = isLeftActive;	
			this.saveMatchToLocalStorage();

			//===> fire active leg
		}
	});
});
