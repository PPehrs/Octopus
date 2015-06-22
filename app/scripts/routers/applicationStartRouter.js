define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout',
	'../views/layout/matchInfo'
],
function(Backbone, Marionette, App, BoardLayout, MatchInfo){
    'use strict';

	return Backbone.Marionette.AppRouter.extend({
		/* Backbone routes hash */
		appRoutes: {
      		'': 'showHome'
    	},
		routes: {
			'match/:id': 'showMatch',
			'board': 'showBoard',
			'*notFound': 'notFound',
			':notFound': 'notFound',
			'/*notFound': 'notFound',
			'!/*notFound': 'notFound'
		},

		showBoard: function() {
			App.mainRegion.show(new BoardLayout());
		},

		showMatch: function(id) {
			App.mainRegion.show(new MatchInfo({matchUid: id}));
		},

		notFound: function() {

		}
	});
});
