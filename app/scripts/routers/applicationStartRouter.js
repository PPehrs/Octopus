define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout',
	'../views/layout/matchInfo',
	'../views/layout/encounterInfo',
	'../views/layout/profileLayout'
],
function(Backbone, Marionette, App, BoardLayout, MatchInfo, EncounterInfo, ProfileLayout){
    'use strict';

	return Backbone.Marionette.AppRouter.extend({
		/* Backbone routes hash */
		appRoutes: {
      		'': 'showHome'
    	},

		routes: {
			'encounter/:id': 'showEncounter',
			'match/:id': 'showMatch',
			'profile/:id': 'showProfile',
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

		showEncounter: function(id) {
			App.mainRegion.show(new EncounterInfo({encounterUid: id}));
		},

		showProfile: function(id) {
			App.mainRegion.show(new ProfileLayout({userId: id}));
		},

		notFound: function() {

		}
	});
});

