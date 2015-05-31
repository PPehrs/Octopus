define([
	'backbone',
	'backbone.marionette'
],
function(Backbone, Controller){
    'use strict';

	return Backbone.Marionette.AppRouter.extend({
		/* Backbone routes hash */
		appRoutes: {
      		'': 'showHome'
    	},
		routes: {
			'board': 'showBoard',
			'*notFound': 'notFound',
			':notFound': 'notFound',
			'/*notFound': 'notFound',
			'!/*notFound': 'notFound'
		},

		showBoard: function() {
			alert('snow')
		},

		notFound: function() {
			alert('gift')
		}		
	});
});
