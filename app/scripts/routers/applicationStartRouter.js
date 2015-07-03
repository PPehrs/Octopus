define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout',
	'../views/layout/matchInfo',
	'../views/layout/encounterInfo',
	'../views/layout/profileLayout',
	'../views/layout/checkOut',
	'../views/layout/liveEncountersOverview'
],
function(Backbone, Marionette, App, BoardLayout, MatchInfo, EncounterInfo, ProfileLayout, CheckOut, LiveOverview){
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
			'check': 'showCheckOutBattle',
			'*notFound': 'notFound',
			':notFound': 'notFound',
			'/*notFound': 'notFound',
			'!/*notFound': 'notFound'
		},

		showLive: function () {
			App.mainRegion.show(new LiveOverview());
		},

		showCheckOutBattle: function () {
			App.mainRegion.show(new CheckOut());
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
			App.mainRegion.show(new BoardLayout());
		}
	});
});


