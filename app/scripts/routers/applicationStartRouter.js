define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout',
	'../views/layout/matchInfo',
	'../views/layout/encounterInfo',
	'../views/layout/profileLayout',
	'../views/layout/checkOut',
	'../views/layout/liveEncountersOverview',
	'../views/layout/compAnalyse'
],
function(Backbone, Marionette, App, BoardLayout, MatchInfo, EncounterInfo, ProfileLayout, CheckOut, LiveOverview, ComputerAnalyse){
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
			'comp': 'showComputerAnalyse',
			'check': 'showCheckOutBattle',
			'*notFound': 'notFound',
			':notFound': 'notFound',
			'/*notFound': 'notFound',
			'!/*notFound': 'notFound'
		},

		showComputerAnalyse: function() {
			App.mainRegion.show(new ComputerAnalyse());
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


