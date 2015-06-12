require([
	'backbone',
	'backbone.marionette',
	'application',
	'communicator',
	'./routers/applicationStartRouter',
	'./controllers/applicationStartController',
	'uuid',
	'regionManager',
	'./modules/socketModule',
	'./modules/matchModule',
	'./global'
],
function ( Backbone, Marionette, App, Communicator, ApplicationStartRouter, ApplicationStartController) {
    'use strict';

	var controller = new ApplicationStartController({});

	/* Add initializers here */
	App.addInitializer( function () {
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
