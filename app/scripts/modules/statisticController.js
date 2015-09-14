define([
	'application',
	'communicator',
	'models/player'
],
function(App, Communicator, PlayerModel) {
	App.module('StatisticController', function(StatisticController) {
		'use strict';
		StatisticController.startWithParent = true;


		StatisticController.calculatePlayerStatistic = function (matches) {
			var fkUser = App.module('LoginModule').loggedInUserId();
			var _self = this;
			var legCount = 0;
			var globEntries = [];
			var globCalc = [];
			var globDarts = [];

			_.each(matches, function(match) {
				var ret = _self.getPlayerEntries(match, fkUser);
				globEntries = globEntries.concat(ret.entries);
				legCount += ret.legCount;
				globCalc = globCalc.concat(ret.calc);
			})

			var calc = _self.calculateTotalFromPlayer(globEntries, legCount);

			var wonMatches = _.where(globCalc, {won: true});
			var bestAveWonMatch = _.max(wonMatches, function(gc) { return gc.ave})

			var lostMatches = _.where(globCalc, {won: false});
			var bestAveLostMatch = _.max(lostMatches, function(gc) { return gc.ave})

			calc.darts = _.flatten(_.pluck(globCalc, 'dartsVal'));
			calc.ckdVals = _.flatten(_.pluck(globCalc, 'ckdVal'));
			calc.shortestLeg = _.min(calc.darts);
			calc.bestFinish = _.max(calc.ckdVals);
			calc.bestAveWon = bestAveWonMatch.ave;
			calc.bestAveWonUid = bestAveWonMatch.matchUid;
			calc.bestAveWonLegs = bestAveWonMatch.checks + ':' + (bestAveWonMatch.legs - bestAveWonMatch.checks)

			calc.bestAveLost = bestAveLostMatch.ave;
			calc.bestAveLostUid = bestAveLostMatch.matchUid;
			calc.bestAveLostLegs = bestAveLostMatch.checks + ':' + (bestAveLostMatch.legs - bestAveLostMatch.checks)

			calc.totalMatches = matches.length;
			calc.totalWonMatches = wonMatches.length;
			calc.totalWonLegs = calc.darts.length;
			calc.totalLegs = _.reduce(globCalc, function(gc, sum) {return gc + sum.legs}, 0);
			calc.h180 = _.reduce(globCalc, function(gc, sum) {return gc + sum.h8}, 0);

			calc.matches = matches;
			return calc;
		},

		StatisticController.getPlayerEntries = function (match, fkUser) {
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
				if(match.activeLeg.entries) {
					entries.push(match.activeLeg.entries)
				}
			}

			entries = _.flatten(entries);

			var isLeft = false;
			if(match.players[0].isLeft && match.players[0].fkUser === fkUser) {
				isLeft = true;
			} else if(match.players[1].isLeft && match.players[1].fkUser === fkUser) {
				isLeft = true;
			}

			if(isLeft) {
				var entries = _.where(entries, {isLeft: true});
				var calc = this.calculateTotalFromPlayer(entries, legCount);
				calc.matchUid = match.uid;
				return {
					calc: calc,
					legCount: legCount,
					entries: _.where(entries, {isLeft: true})
				}
			} else {
				var entries = _.where(entries, {isLeft: false});
				var calc = this.calculateTotalFromPlayer(entries, legCount);
				calc.matchUid = match.uid;
				return {
					calc: calc,
					legCount: legCount,
					entries: _.where(entries, {isLeft: false})
				}
			}
		};

		StatisticController.calculateTotalFromPlayer = function (entries, legCount) {
			var specialData = {
				ave: 0,
				dbl: 0,
				dblThrows: 0,
				checks: 0,
				ut: 0,
				s: 0,
				t: 0,
				t4: 0,
				h8: 0,
				ckdVal: [],
				dartsVal: [],
				hasCheckVals: false,
				won: false
			}

			var newCol = [];
			newCol.push({rest: (501 * legCount)});
			var lastRest = 501;
			var totalScore = 0;
			var totalDarts = 0;
			var checks = 0;
			var misses = 0;
			var dblThrows = 0;
			var checkMisses = 0;
			var first9 = 0;
			var tournament3Val = 0;
			var tournament3Rounds = 0;
			var round = 1;
			var ccF9 = 0;
			var checks3 = 0;
			var dbl3 = 0;
			var isFirstChecks3 = true;
			var legs = 0;

			_.each(entries, function (c) {

				if(round <= 3) {
					first9 += Number(c.value);
					ccF9 += 1;
				}

				totalDarts += 3;

				if (c.value >= 60 && c.value < 100) {
					specialData.s += 1;
				} else if (c.value >= 100 && c.value < 140) {
					specialData.t += 1;
				} else if (c.value >= 140 && c.value < 180) {
					specialData.t4 += 1;
				} else if (c.value >= 180) {
					specialData.h8 += 1;
				}
				if(c.check) {
					checks += 1;
					dblThrows += 1;
					specialData.ckdVal.push(c.value);
					var tDarts = round * 3;
					if(c.check === '1.') {
						tDarts -= 2;
						totalDarts -= 2;
					} else if(c.check === '2.') {
						tDarts -= 1;
						totalDarts -= 1;
					}
					specialData.dartsVal.push(tDarts);
					round = 0;
					lastRest = 501;
					isFirstChecks3 = true;
					legs++;
				}

				if(c.miss) {
					misses += c.miss;
					dblThrows += c.miss;
				}

				totalScore += Number(c.value);
				var rest = lastRest - c.value;
				newCol.push({rest: rest, value: c.value});

				var doRest = App.module("CompController").isDouble(lastRest)
				if(doRest) {
					if(isFirstChecks3) {
						dbl3 += 1;
						if(c.check) {
							checks3 += 1;
						}
						isFirstChecks3 = false;
					}
				}


				lastRest = rest;

				if(rest >= 100) {
					if (c.value <= 30) {
						specialData.ut += 1;
					}
				}


				if(c.oCkd) {
					round = 0;
					lastRest = 501;
					isFirstChecks3 = true;
					legs++;
				} else {
					var canCheck = App.module("MatchModule").possibleCheckWith(rest);
					if(!canCheck) {
						tournament3Val += Number(c.value);
						tournament3Rounds += 1;
					}
				}

				round += 1;
			});

			if(newCol.length > 1) {
				specialData.ave = ((totalScore / totalDarts) * 3).toFixed(2);
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

			specialData.ave9 = (first9 / (3 * legCount)).toFixed(2);
			specialData.ave3Tour = (tournament3Val / (tournament3Rounds)).toFixed(2);

			specialData.dbl3 = dbl3;
			specialData.checks3 = checks3;
			specialData.won = checks > legs - checks;
			specialData.legs = legs;

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
				if(match.activeLeg.entries) {
					entries.push(match.activeLeg.entries)
				}
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
			var count = 0;
			_.each(entriesCollection, function (c) {
				count += 1;
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
				if(c.check) {
					var ada = (count * 3) - (3 - Number(c.check[0]));
					newCol.push({rest: rest, value: c.value, isCheck: true, check: c.check, darts: ada});
				} else {
					newCol.push({rest: rest, value: c.value});
				}
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
