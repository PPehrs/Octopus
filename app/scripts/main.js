require([
	'backbone',
	'backbone.marionette',
	'application',
	'communicator',
	'./modules/socketModule',
	'./routers/applicationStartRouter',
	'./controllers/applicationStartController',
	'regionManager'
],
function ( Backbone, Marionette, App, Communicator, SocketModule, ApplicationStartRouter, ApplicationStartController ) {
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
