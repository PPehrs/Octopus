define([
	'application',
	'communicator',
	'models/player'
],
function(App, Communicator, PlayerModel) {
	App.module('StatisticController', function(StatisticController) {
		'use strict';
		StatisticController.startWithParent = true;
	});
});
