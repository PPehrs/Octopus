require([
	'jquery',
	'underscore',
	'backbone',
	'backbone.marionette',
	'backbone.stickit',
	'application',
	'communicator',
	'./routers/applicationStartRouter',
	'./controllers/applicationStartController',
	//just start
	'regionManager',
	'modules/socketModule',
	'modules/dialogModule',
	'modules/loginModule',
	'modules/playerController',
	'modules/encounterController',
	'modules/statisticController',
	'modules/compController',
	'./global'
],
function ( $, _, Backbone, Marionette, Stickit, App, Communicator, ApplicationStartRouter, ApplicationStartController) {
    'use strict';

	var controller = new ApplicationStartController({});

	/* Add initializers here */
	App.addInitializer( function () {
		_.templateSettings =
		{
			escape: /<%[=-]([\s\S]+?)%>/g,
			interpolate: /<%cleanHtml([\s\S]+?)cleanHtml%>/g,
			evaluate: /<%([\s\S]+?)%>/g
		};
		var octopusStore = localStorage.getItem('octopus');
		if(_.isEmpty(octopusStore)) {
			localStorage.setItem('octopus', JSON.stringify({}));
		}
        // initialize the router
        var router = new ApplicationStartRouter({
        	controller: controller
        });

		Communicator.mediator.trigger("APP:START");
	});

    App.on("start", function(){
      // Start Backbone history a necessary step for bookmarkable URL's
      Backbone.history.start();
    });

	App.start();
});

