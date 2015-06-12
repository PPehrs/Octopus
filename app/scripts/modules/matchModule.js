define([
	'application'
],
function(App) {
	App.module('MatchModule', function(MatchModule) {
		'use strict';

		MatchModule.startWithParent = false;

		MatchModule.addInitializer(function() {
			console.log('JOJO MatchModule')
		});

		MatchModule.addFinalizer(function() {
			console.log('CLEAR MatchModule')
		});

		MatchModule.Hyper = function () {
			console.log('HYYYYYYYYYPERRRRRRRRRR');
		};
	});
});
