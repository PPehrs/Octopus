define([
	'application',
	'communicator'
],
function(App, Communicator) {
	App.module('CompController', function(CompController) {
		'use strict';

		CompController.startWithParent = true;

		CompController.s1 = [180,
			140,
			135,
			125,
			123,
			121,
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

		CompController.s3 = [50,
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


		CompController.buildPro = function () {
			var comp = [];
			for (var i = 0; i < 20; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 15; i++) {
				comp = comp.concat(this.s2);
			}
			for (var i = 0; i < 5; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 1; i++) {
				comp = comp.concat(this.s1);
			}

			var score = Math.floor((Math.random() * comp.length));
			return comp[score];
		},

		CompController.buildP1 = function () {
			var comp = [];
			for (var i = 0; i < 10; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 20; i++) {
				comp = comp.concat(this.s2);
			}
			for (var i = 0; i < 10; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 3; i++) {
				comp = comp.concat(this.s1);
			}

			var score = Math.floor((Math.random() * comp.length));
			return comp[score];
		},

		CompController.buildP2 = function () {
			var comp = [];
			for (var i = 0; i < 3; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 20; i++) {
				comp = comp.concat(this.s2);
			}
			for (var i = 0; i < 25; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 5; i++) {
				comp = comp.concat(this.s1);
			}

			var score = Math.floor((Math.random() * comp.length));
			return comp[score];
		},

		CompController.buildP3 = function () {
			var comp = [];
			for (var i = 0; i < 1; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 5; i++) {
				comp = comp.concat(this.s2);
			}
			for (var i = 0; i < 20; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 10; i++) {
				comp = comp.concat(this.s1);
			}

			var score = Math.floor((Math.random() * comp.length));
			return comp[score];
		},

		CompController.buildP4 = function () {
			var comp = [];
			for (var i = 0; i < 1; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 5; i++) {
				comp = comp.concat(this.s2);
			}
			for (var i = 0; i < 30; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 20; i++) {
				comp = comp.concat(this.s1);
			}

			var score = Math.floor((Math.random() * comp.length));
			return comp[score];
		},

		CompController.buildP5 = function () {
			var comp = [];
			for (var i = 0; i < 1; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 4; i++) {
				comp = comp.concat(this.s2);
			}
			for (var i = 0; i < 40; i++) {
				comp = comp.concat(this.s1);
			}
			for (var i = 0; i < 30; i++) {
				comp = comp.concat(this.s1);
			}

			var score = Math.floor((Math.random() * comp.length));
			return comp[score];
		},


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
		}
	});
});
