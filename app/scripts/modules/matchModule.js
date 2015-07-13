define([
	'application',
	'communicator'
],
function(App, Communicator) {
	App.module('MatchModule', function(MatchModule) {
		'use strict';

		MatchModule.cold = false;
		MatchModule.started = false;
		MatchModule.match = {};
		MatchModule.encounterUid = null;
		MatchModule.encounterMatchStarted = false;

		MatchModule.startWithParent = false;

		MatchModule.possibleCheckWith = function(value) {
			if(value === 170 || value === 167 || value === 164 ||
			   value === 161 || value === 160 || (value <= 158 && value > 110) ||
			   value === 109 || value === 108 || value === 106 || value === 105 ||
			   value === 103 || value === 102 || value == 99) {
				return 1;
			}

			if(value === 110 || value === 107 || value == 104 || value == 101 || value == 100) {
				return 2;
			}

			if(value === 50) {
				return 3;
			}

			if((value < 99 && value > 40)) {
				return 2;
			}

			if(value <= 40 && value > 1) {
				if((value % 2) === 0) {
					return 3;
				} else {
					return 2;
				}
			}
		};


		MatchModule.isUndoPossible = function() {
			return (this.started &&
				!_.isEmpty(this.match) &&
				this.match.started);
		};

		MatchModule.undoLast = function() {
			if(this.isUndoPossible()) {
				//first check active leg
				if(this.match.activeLeg && !_.isEmpty(this.match.activeLeg.entries) && this.match.activeLeg.entries.length > 0) {
					var entry = _.last(this.match.activeLeg.entries);
					return entry;
				}

				if(!_.isEmpty(this.match.sets)) {
					var lastSet = _.last(this.match.sets);
					if(!_.isEmpty(lastSet)) {
						var lastLeg = _.last(lastSet.legs);
						if(!_.isEmpty(lastLeg)) {
							lastLeg.entries.splice(lastLeg.entries.length-1, 1)
							this.match.activeLeg = lastLeg;
							lastSet.legs.splice(lastSet.legs.length-1, 1);

							this.match.leg = lastSet.legs.length;

							var result = this.wonLegsAndSets();
							var activeLeg = this.match.activeLeg;
							var isPlayerLeftActive = !(_.last(lastLeg.entries)).isLeft;

							this.match.state.playerLeftStartsLeg =  (_.first(activeLeg.entries)).isLeft;
							this.match.state.isPlayerLeftActive = isPlayerLeftActive;

							this.saveMatchToLocalStorage();

							setTimeout(function() {
								Communicator.mediator.trigger('load:match', isPlayerLeftActive, result, activeLeg);
							})
						}
					}
				}
			}
		};

		MatchModule.wonLegs = function () {
			var lcheck = 0;
			var rcheck = 0;
			_.each(this.match.sets, function (aSet) {
				_.each(aSet.legs, function (aLeg) {
					var aCheck = _.find(aLeg.entries, function (entry) {
						return entry.check > 0;
					})

					if (!_.isEmpty(aCheck) && aCheck.isLeft) {
						lcheck += 1;
					} else if (!_.isEmpty(aCheck) && !aCheck.isLeft) {
						rcheck += 1;
					}

				});
			});

			return {
				left: {
					legs: lcheck
				},
				right: {
					legs: rcheck
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
				this.matchReset(octopusStore);
				if(MatchModule.encounterUid) {
					Communicator.mediator.trigger('match:started:' + MatchModule.encounterUid, this.match.uid);
				}
			} else {
				try {
					this.match = octopusStore.match;
					console.log('heavy load - load match from store');

					var result = this.wonLegsAndSets();
					var activeLeg = this.match.activeLeg;

					var isPlayerLeftActive = this.match.state.isPlayerLeftActive;

					Communicator.mediator.trigger('load:match', isPlayerLeftActive, result, activeLeg);
				} catch(e) {
					this.matchReset(octopusStore);
				}
			}
			this.started = true;
		});

		MatchModule.matchReset = function(octopusStore) {
				var players = [];
				if(!octopusStore.players || _.isEmpty(octopusStore.players)) {
					players = octopusStore.players;
				}

				var matchUid = octopus.uuid();

				var matchStatus = {
					playerLeftStartsLeg: true,
					playerLeftStartsSet: true,
					isPlayerLeftActive: true
				};

				this.match = {
					uid: matchUid,
					startDateTime: Date.now(),
					activeSet: 0,
					leg: 0,
					state: matchStatus,
					started: false,
					players: players
				}

				_.extend(octopusStore, {match: this.match});
				localStorage.setItem('octopus', JSON.stringify(octopusStore));

				Communicator.mediator.trigger('load:match', true, null, null);
		};

		MatchModule.addFinalizer(function() {
			this.match = {};
			if(!MatchModule.cold) {
				this.deleteMatchFromLocalStorage();
				if(!MatchModule.encounterMatchStarted) {
					var octopusStore = JSON.parse(localStorage.getItem('octopus'));
					if (octopusStore.activeEncounterMatch) {
						octopusStore.activeEncounterMatch = {};
					}
					localStorage.setItem('octopus', JSON.stringify(octopusStore));
				} else {
					MatchModule.encounterMatchStarted = false;
				}
			}
			MatchModule.cold = false;
			this.started = false;

			//===> fire match done
		});

		MatchModule.deleteMatchFromLocalStorage = function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore && octopusStore.match) {
				octopusStore.match = {};
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			}
		};

		MatchModule.saveMatchToLocalStorage = function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore.activeEncounter) {
				this.match.fkEncounter  = octopusStore.activeEncounter.uid;
			}

			if(!_.isEmpty(octopusStore.players)) {
				this.match.players  = octopusStore.players;
			}

			octopusStore.match = this.match;

			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		};

		MatchModule.savePlayerToMatch = function (players) {
			this.match.players = players;
			this.saveMatchToLocalStorage();
		},

		//----------------------------------------------------------------------

		MatchModule.wonLegsAndSets = function(value, check) {
			var leftLegs = 0;
			var rightLegs = 0;
			var leftDartsTotal = [];
			var rightDartsTotal = [];

			if(!_.isEmpty(this.match.sets)) {
				var legsEntries = _.pluck(this.match.sets[this.match.activeSet].legs, 'entries');
				_.each(legsEntries, function(legEntries) {
					var rightDarts = 0;
					var leftDarts = 0;
					var isLeftChecked = false;
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
					leftDartsTotal.push({
						darts: leftDarts,
						checked: isLeftChecked
					})
					rightDartsTotal.push({
						darts: rightDarts,
						checked: !isLeftChecked
					})
				})
			}

			return {
				left: {
					darts: leftDartsTotal,
					legsWon: leftLegs,
					endOf: true
				},
				right: {
					darts: rightDartsTotal,
					legsWon: rightLegs,
					endOf: true
				},
				countLegs: this.match.leg,
			}
		};

		MatchModule.check = function(value, miss, check, checkValue) {
			if(!this.match.started) {
				return;
			}
			var playerLeftStartsSet = this.match.state.playerLeftStartsSet;
			var playerLeftStartsLeg = this.match.state.playerLeftStartsLeg;
			var isPlayerLeftActive = this.match.state.isPlayerLeftActive;

			if(!this.match.sets) {
				this.match.sets = [];
			}

			if(this.match.sets.length <= this.match.activeSet) {
				this.match.sets.push({
					playerLeftStartsSet: this.match.state.playerLeftStartsSet,
					legs: []
				})
			}

			var set = this.match.sets[this.match.activeSet];

			if(!checkValue && check === '1.') {
				if(value) {
					checkValue = value / 2;
				}
			}

			var entry = {
				value: value,
				checkValue: checkValue,
				check: check,
				playerLeftStartsLeg: playerLeftStartsLeg,
				isLeft: isPlayerLeftActive
			};

			if(miss) {
				_.extend(entry, {miss: miss});
			}

			var activeLeg = this.match.activeLeg;

			activeLeg.entries[activeLeg.entries.length -1].oCkd = true;

			activeLeg.entries.push(entry);
			set.legs.push(activeLeg);

			this.match.state.playerLeftStartsLeg = !playerLeftStartsLeg;
			this.match.state.isPlayerLeftActive = !playerLeftStartsLeg;
			this.match.activeLeg = {};

			this.match.leg += 1;

			this.saveMatchToLocalStorage();

			//--> fire
			Communicator.mediator.trigger('matchModule:check', this.match);
			this.syncMatch();
		};

		MatchModule.changeScore  = function(value, uid) {
			var entry = _.findWhere(this.match.activeLeg.entries, {uid:uid});
			entry.value = value;
			this.saveMatchToLocalStorage();
			//--> fire

			return {
				isLeft: entry.isLeft,
				entries: _.where(this.match.activeLeg.entries, {isLeft:entry.isLeft})
			}
		};

		MatchModule.newScore = function(value, miss, isLeftActive, uid) {
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

			if(miss) {
				_.extend(entry, {miss: miss});
			}

			this.match.activeLeg.entries.push(entry);
			this.match.state.isPlayerLeftActive = isLeftActive;

			this.saveMatchToLocalStorage();

			//===> fire active leg
			this.syncMatch();
		};


		MatchModule.syncMatchFrom = function (data) {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore.activeEncounter) {
				_.extend(data, {fkEncounter: octopusStore.activeEncounter.uid});
			}
			Communicator.mediator.trigger('APP:SOCKET:EMIT', 'match-data', data);
		};

		MatchModule.syncMatch = function () {
			if(!App.module('LoginModule').isLoggedIn()) {
				return;
			}
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(_.isEmpty(octopusStore.activeEncounter)) {
				return;
			}

			if(!_.isEmpty(this.match.players)) {
				Communicator.mediator.trigger('APP:SOCKET:EMIT', 'match-data', this.match);
			}
		};
	});
});
