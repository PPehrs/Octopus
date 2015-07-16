define([
	'application',
	'communicator'
],
function(App, Communicator) {
	App.module('CompController', function(CompController) {
		'use strict';

		CompController.startWithParent = true;


		CompController.setScore = function (comp) {
			setTimeout(function () {
				var score = Math.floor((Math.random() * 180) + 1);
				Communicator.mediator.trigger('comp:score:new', score, comp);
			}, 1000)
		}
	});
});
