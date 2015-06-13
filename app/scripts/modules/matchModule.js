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

		MatchModule.wonLegsAndSets = function(value, check) {
			var leftLegs = 0;
			var rightLegs = 0;
			var leftDarts = 0;
			var rightDarts = 0;
			var isLeftChecked = false;

			var legsEntries = _.pluck(this.match.sets[this.match.set].legs, 'entries');
			_.each(legsEntries, function(legEntries) {
			_.each(legEntries, function(entry) {
				var darts = 3;
				if(entry.isLeft) {
					if(entry.check) {
						darts = Number(entry.check);
						leftLegs += 1;
						isLeftChecked = true;
					}	
					leftDarts += darts;

				} else {
					if(entry.check) {
						darts = Number(entry.check);
						rightLegs += 1;
						isLeftChecked = false;
					}	
					rightDarts += darts;
				}
			})
			})
			
			return {
				left: {
					darts: leftDarts,
					legsWon: leftLegs
				},
				right: {
					darts: rightDarts,
					legsWon: rightLegs
				},
				countLegs: this.match.leg,
				isLeftCheck: isLeftChecked, 
			}
		},

		MatchModule.check = function(value, check) {
			if(!this.match.started) {
				return; 
			}
			var playerLeftStartsSet = this.match.state.playerLeftStartsSet;
			var playerLeftStartsLeg = this.match.state.playerLeftStartsLeg;
			var isPlayerLeftActive = this.match.state.isPlayerLeftActive;

			if(!this.match.sets) {
				this.match.sets = [];
			}

			if(this.match.sets.length <= this.match.set) {
				this.match.sets.push({
					playerLeftStartsSet: this.match.state.playerLeftStartsSet,
					legs: []
				})
			}

			var set = this.match.sets[this.match.set];
			var entry = {
				value: value,
				check: check,
				playerLeftStartsLeg: playerLeftStartsLeg,
				playerLeftCheckedleg: isPlayerLeftActive
			};

			var activeLeg = this.match.activeLeg;
			activeLeg.entries.push(entry);
			set.legs.push(activeLeg);

			this.match.state.playerLeftStartsLeg = !playerLeftStartsLeg;
			this.match.state.isPlayerLeftActive = !playerLeftStartsLeg;
			this.match.activeLeg = {};

			this.match.leg += 1;

			this.saveMatchToLocalStorage();
			//--> fire
		}

		MatchModule.newScore = function(value, isLeftActive, uid) {
			if(!this.match.started) {
				this.match.started = true;
			}

			if(_.isEmpty(this.match.activeLeg)) {
				this.match.activeLeg = {
					uid: _.uniqueId('l_'),
					startDateTime: Date.now(),
					entries: []
				}
			}

			var entry = {
				value: value,
				uid: uid,
				isLeft: !isLeftActive
			};

			this.match.activeLeg.entries.push(entry);
			this.match.state.isPlayerLeftActive = isLeftActive;	
			this.saveMatchToLocalStorage();

			//===> fire active leg
		}
	});
});
