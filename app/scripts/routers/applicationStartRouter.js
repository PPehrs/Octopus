define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout',
	'../views/layout/matchInfo',
	'../views/layout/encounterInfo',
	'../views/layout/profileLayout',
	'../views/layout/liveEncountersOverview'
],
function(Backbone, Marionette, App, BoardLayout, MatchInfo, EncounterInfo, ProfileLayout, LiveOverview){
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
			'live': 'showLive',
			'*notFound': 'notFound',
			':notFound': 'notFound',
			'/*notFound': 'notFound',
			'!/*notFound': 'notFound'
		},

		showLive: function () {
			App.mainRegion.show(new LiveOverview());
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


