define([
	'application',
	'communicator',
	'models/player'
],
function(App, Communicator, PlayerModel) {
	App.module('StatisticController', function(StatisticController) {
		'use strict';
		StatisticController.startWithParent = true;


		StatisticController.calculateTotalFromPlayer = function (entries, legCount) {
			var specialData = {
				ave: 0,
				dbl: 0,
				dblThrows: 0,
				checks: 0,
				s: 0,
				t: 0,
				t4: 0,
				h8: 0,
				ckdVal: [],
				dartsVal: [],
				hasCheckVals: false
			}

			var newCol = [];
			newCol.push({rest: (501 * legCount)});
			var lastRest = 501;
			var totalScore = 0;
			var checks = 0;
			var misses = 0;
			var dblThrows = 0;
			var checkMisses = 0;
			var round = 1;
			_.each(entries, function (c) {
				if (c.value >= 60 && c.value < 100) {
					specialData.s += 1;
				} else if (c.value >= 100 && c.value < 140) {
					specialData.t += 1;
				} else if (c.value >= 140 && c.value < 180) {
					specialData.t4 += 1;
				} else if (c.value >= 180) {
					specialData.h8 += 1;
				}
				console.log(c.value)
				if(c.check) {
					checks += 1;
					dblThrows += 1;
					specialData.ckdVal.push(c.value);
					var tDarts = round * 3;
					if(c.check === '1.') {
						tDarts -= 2;
					} else if(c.check === '2.') {
						tDarts -= 1;
					}
					specialData.dartsVal.push(tDarts);
					round = 0;
				}

				if(c.miss) {
					misses += c.miss;
					dblThrows += c.miss;
				}

				totalScore += Number(c.value);
				var rest = lastRest - c.value;
				newCol.push({rest: rest, value: c.value});
				lastRest = rest;

				if(c.oCkd) {
					round = 0;
				}

				round += 1;
			});

			if(newCol.length > 1) {
				specialData.ave = (totalScore / (newCol.length-1)).toFixed(2);
			}

			if(checks) {
				if(!misses) {
					specialData.dbl = 100;
				} else {
					specialData.dbl = ((checks / dblThrows) * 100).toFixed(0);
				}
			}

			if(!_.isEmpty(specialData.ckdVal)) {
				specialData.hasCheckVals = true;
				specialData.ckdValText = specialData.ckdVal.join();
				specialData.dartsValText = specialData.dartsVal.join();
			}

			specialData.dblThrows = dblThrows;
			specialData.checks = checks;

			return specialData;
		};

		StatisticController.calculateTotal = function (match) {

			var entries = [];
			var legCount = 0;

			if (match.sets)  {
				_.each(match.sets, function(aSet) {
					_.each(aSet.legs, function(aLeg) {
						legCount += 1;
						entries.push(aLeg.entries)
					});
				});
			}

			if (match.activeLeg)  {
				legCount += 1;
				entries.push(match.activeLeg.entries)
			}

			entries = _.flatten(entries);

			var l = _.where(entries, {isLeft: true});
			var r = _.where(entries, {isLeft: false});

			var lData = StatisticController.calculateTotalFromPlayer(l, legCount);
			var rData = StatisticController.calculateTotalFromPlayer(r, legCount);

			return {
				lData: lData,
				rData: rData
			}
		};

		StatisticController.calculateActiveLeg = function (entriesCollection) {
			var specialData = {
				ave: 0,
				s: 0,
				t: 0,
				t4: 0,
				h8: 0
			}
			var newCol = [];
			newCol.push({rest: 501});
			var lastRest = 501;
			var totalScore = 0;
			_.each(entriesCollection, function (c) {
				if (c.value >= 60 && c.value < 100) {
					specialData.s += 1;
				} else if (c.value >= 100 && c.value < 140) {
					specialData.t += 1;
				} else if (c.value >= 140 && c.value < 180) {
					specialData.t4 += 1;
				} else if (c.value === 180) {
					specialData.h8 += 1;
				}

				totalScore += Number(c.value);
				var rest = lastRest - c.value;
				if(rest <= 1) {
					rest = lastRest;
				}
				newCol.push({rest: rest, value: c.value});
				lastRest = rest;
			});

			if(newCol.length > 1) {
				specialData.ave = (totalScore / (newCol.length-1)).toFixed(2);
			}
			return {
				specialData: specialData,
				newCollection: newCol
			};
		};
	});
});
