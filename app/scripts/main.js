require([
	'backbone',
	'backbone.marionette',
	'application',
	'communicator',
	'./routers/applicationStartRouter',
	'./controllers/applicationStartController',
	'regionManager',
	'./modules/socketModule',
	'./global'
],
function ( Backbone, Marionette, App, Communicator, ApplicationStartRouter, ApplicationStartController) {
    'use strict';

	var controller = new ApplicationStartController({});

	/* Add initializers here */
	App.addInitializer( function () {
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
