define([
	'application',
	'communicator'
],
function(App, Communicator) {
	App.module('CompController', function(CompController) {
		'use strict';

		CompController.startWithParent = true;

		CompController.possi = 0;
		CompController.compGame = -1;
		CompController.lastFrom = -1;
		CompController.under = -1;

		CompController.c1 = [2, 4, 6, 8, 10, 12, 14];
		CompController.c2 = [4, 8, 12, 16, 20, 24, 28];
		CompController.c3 = [6, 12, 18, 24, 30, 36, 42];
		CompController.c4 = [8, 16, 24, 32, 40, 48, 56];
		CompController.c5 = [10, 20, 30, 40, 50, 60, 70];

		CompController.cm1 = [0, 0, 0, 0, 0, 0, 1, 1, 1, 2];

		CompController.douts = [50, 40, 38, 36, 34, 32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];

		CompController.s10 = [180,
			135,
			125,
			123,
			121,
			100];

		CompController.s11 = [180,
			140,
			140,
			135,
			125,
			123,
			121,
			100,
			100,
			100,
			100];			

		CompController.s1 = [180,
			140,
			140,
			135,
			125,
			123,
			121,
			100,
			100,
			100,
			100,
			100];

		CompController.s2 = [95,
			90,
			85,
			80,
			70,
			83,
			81,
			66,
			64,
			62,
			78,
			76,
			66];

		CompController.s3 = [60, 50,
			45,
			41,
			40,
			30,
			26,
			24,
			23,
			22,
			38,
			36,
			28,
			26];

		CompController.s33 = [80, 60,
			60,
			60,
			50,
			45,
			41,
			45,
			41,
			40,
			45,
			41,
			45,
			41,
			40,			
			30,
			26,
			24,
			23,
			22,
			38,
			36,
			28,
			26];			

		CompController.s4 = [35,
			33,
			31,
			23,
			21,
			15,
			13,
			11,
			9,
			7,
			5,
			4,
			3];

		CompController.cT = 0;

		CompController.build = function (l1, l2, l3, l4, theComp) {
			var comp = [];
			for (var i = 0; i < l1; i++) {
				comp = comp.concat(1);
			}
			for (var i = 0; i < l2; i++) {
				comp = comp.concat(2);
			}
			for (var i = 0; i < l3; i++) {
				comp = comp.concat(3);
			}
			for (var i = 0; i < l4; i++) {
				comp = comp.concat(4);
			}

			var da = Math.floor((Math.random() * comp.length));
			var from = comp[da];

			if(theComp === 1 && CompController.lastFrom > 2) {
				from = Math.floor((Math.random() * 2) + 1);
			} else if(theComp === 2 && CompController.lastFrom > 3) {
				from = Math.floor((Math.random() * 3) + 1);
			} else if(theComp === 3) {
				 if(CompController.lastFrom > 3) {
					from = Math.floor((Math.random() * 3) + 1);
				}
				else if(CompController.lastFrom < 2) {
					from = Math.floor((Math.random() * 3) + 2);
				}			

				if(CompController.under > 2) {
					CompController.under = 0;
					from = Math.floor((Math.random() * 2) + 1);
				}

				if(from > 2) {
					CompController.under += 1;
				}
			} else if(theComp === 4 && CompController.lastFrom < 2) {
				from = Math.floor((Math.random() * 3) + 2);

				if(CompController.under > 2) {
					CompController.under = 0;
					from = Math.floor((Math.random() * 2) + 3);
				}
				if(from <= 2) {
					CompController.under += 1;
				}
			} 


			CompController.lastFrom = from;


			var score = 99;

			if(from === 1) {
				if(theComp  === 1) {
					var pos = Math.floor((Math.random() * CompController.s10.length));
					score = CompController.s10[pos];
				} else if(theComp  === 2) {
					var pos = Math.floor((Math.random() * CompController.s11.length));
					score = CompController.s11[pos];					
				}
				else {
					var pos = Math.floor((Math.random() * CompController.s1.length));
					score = CompController.s1[pos];
				}
			} else if ( from === 2) {
				var pos = Math.floor((Math.random() * CompController.s2.length));
				score = CompController.s2[pos];
			} else if ( from === 3) {
				if(theComp  >= 4) {
					var pos = Math.floor((Math.random() * CompController.s33.length));
					score = CompController.s33[pos];
				} else {
					var pos = Math.floor((Math.random() * CompController.s3.length));
					score = CompController.s3[pos];
				}				
			} else if ( from === 4) {
				var pos = Math.floor((Math.random() * CompController.s4.length));
				score = CompController.s4[pos];
			}

			return score;
		};

		CompController.buildPro = function () {
			return this.build(
				CompController.c5[6],
				CompController.c2[6],
				CompController.c2[6],
				CompController.c1[0],
				1
			)
		};

		CompController.buildP1 = function () {
			return this.build(
				CompController.c3[6],
				CompController.c5[6],
				CompController.c2[4],
				CompController.c2[0],
				2
			)
		};

		CompController.buildP2 = function () {
			return this.build(
				CompController.c2[6],
				CompController.c3[6],
				CompController.c4[6],
				CompController.c2[6],
				3
			)
		};

		CompController.buildP3 = function () {
			return this.build(
				CompController.c1[2],
				CompController.c2[5],
				CompController.c5[6],
				CompController.c1[3],
				4
			)
		};

		CompController.buildP4 = function () {
			return this.build(
				CompController.c1[0],
				CompController.c2[5],
				CompController.c5[6],
				CompController.c2[6],
				5
			)
		};

		CompController.buildP5 = function () {
			return this.build(
				CompController.c1[0],
				CompController.c2[3],
				CompController.c3[4],
				CompController.c3[5],
				6
			)
		};

		CompController.setCheckR = function(comp, pos, missIn) {
			var l = [];
			if(comp === 1) {
				l = CompController.c1;
			} else if(comp === 2) {
				l = CompController.c2;
			} else if(comp === 3) {
				l = CompController.c3;
			} else if(comp === 4) {
				l = CompController.c4;
			} else if(comp > 4) {
				l = CompController.c5;
			} 

			pos = pos - CompController.possi  >= 0 ? pos - CompController.possi : 0;

			var da = Math.floor((Math.random() * l[pos]));

			if(da < missIn) {
				return true;
			} else {
				return false;
			}
		};

		CompController.getADouble = function() {
			return CompController.douts[Math.floor((Math.random() * CompController.douts.length))];
		};

		CompController.getCheckMiss = function(l) {
			return CompController.cm1[Math.floor((Math.random() * CompController.cm1.length))];
		};		

		CompController.isDouble = function(rest) {
			if((rest <= 40 && rest % 2 === 0) || rest === 50) {
				return true;
			} else {
				return false;
			}
		}

		CompController.setCheck = function (comp, rest, missIn, scoreIn) {
			var newRest = rest;
			var miss = missIn;
			var score = scoreIn;

			if(rest - scoreIn < 2) {
				score = 0;	
				score = Math.floor((Math.random() * (rest-1)) + 2);
				if(rest - score < 2) {
					score = 0;	
				}
			}

			var canC = false;
			var canDPos = 2;
			var canDMiss = miss;

			if(rest > 130) {
				if(rest === 159 || rest === 162 || rest == 163 || rest == 165 || rest == 168 || rest == 169) {
					canDPos = 1;
					canDMiss = 2;
					miss = 0;
				} else {
					canC = CompController.setCheckR(comp, 3, miss);
				}
			} else if(rest >= 99) {
				canC = CompController.setCheckR(comp, 2, miss);
			}
			else if((rest > 40 && rest < 50) || rest > 50) {
				canC = CompController.setCheckR(comp, 2, miss);
			} else {
				canC = CompController.setCheckR(comp, 1, miss);
			}

			if(!canC) {
				var canD = CompController.setCheckR(comp, canDPos, canDMiss);
				if(canD) {
					newRest = CompController.getADouble();
					if(rest - newRest < 2) {
						newRest = 2;
					}
					score = rest - newRest;
				} else {
					newRest = rest - score;
				}

				if(comp === 1 && !CompController.isDouble(newRest)) {
					miss = 0;
				}
			} else {
				newRest = CompController.getADouble()/2;
				if(miss === 3) {
					if(comp === 1) {
						miss = CompController.getCheckMiss(CompController.cm1);
					}
				}
			}

			CompController.possi += 1;

			return {
				check: canC,
				rest: newRest,
				miss: miss,
				score: score
			}
		};

		CompController.init = function (comp) {
			CompController.possi = 0;
			CompController.compGame = comp;
		};

		CompController.setScore = function (comp) {
			var score = CompController.buildP5;
			if(comp === 1) {
				score = this.buildPro();
			} else if(comp === 2) {
				score = this.buildP1();
			} else if(comp === 3) {
				score = this.buildP2();
			} else if(comp === 4) {
				score = this.buildP3();
			}

			setTimeout(function () {
				Communicator.mediator.trigger('comp:score:new', score, comp);
			}, 1000)
		};
	});
});
