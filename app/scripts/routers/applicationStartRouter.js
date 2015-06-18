define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout'
],
function(Backbone, Marionette, App, BoardLayout){
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
			App.mainRegion.show(new BoardLayout());
		},

		notFound: function() {

		}		
	});
});
