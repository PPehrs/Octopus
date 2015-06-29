define([
	'backbone',
	'backbone.marionette',
	'bootbox',
	'communicator',
	'hbs!tmpl/layout/homeLayout_tmpl',

	'../composite/home/onlinePlayers',
	'../composite/home/registeredPlayers',
	'../composite/home/liveMatches',
],
function( Backbone,
		  Marionette,
		  Bootbox,
		  Communicator,
		  HomelayoutTmpl,

		  OnlinePlayers,
		  RegisteredPlayers,
		  LiveMatches
 ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

    	template: HomelayoutTmpl,


    	/* Layout sub regions */
    	regions: {
			panelPlayerRegisteredRegion: '#panelPlayerRegisteredRegion',
			panelEncounterLiveRegion: '#panelEncounterLiveRegion',
			panelPlayerOnlineRegion: '#panelPlayerOnlineRegion'
		},

    	/* ui selector cache */
    	ui: {
    		buttonStartNewGame: '#btnStartNewGame',
    		buttonLoginPlayer: '#btnLoginPlayer',
    		buttonRegisterPlayer: '#btnRegisterPlayer',
			buttonPlayerProfile: '#btnPlayerProfile'
    	},

		/* Ui events hash */
		events: {
			'click @ui.buttonStartNewGame': '_onClickButtonStartNewGame',
			'click @ui.buttonLoginPlayer': '_onClickButtonLoginPlayer',
			'click @ui.buttonRegisterPlayer': '_onClickButtonRegisterPlayer'
		},

		initialize: function () {
			this.listenTo(Communicator.mediator, 'DialogModule:LOGGED-IN', this.onLoggedIn);
			this.listenTo(Communicator.mediator, 'DialogModule:LOGGED-OUT', this.onLoggedOut);
		},

		onLoggedOut: function () {
			this.ui.buttonPlayerProfile.hide();
			this.ui.buttonLoginPlayer.show();
		},

		onLoggedIn: function () {
			this.ui.buttonPlayerProfile.show();
			this.ui.buttonLoginPlayer.hide();
		},

		/* on render callback */
		onRender: function() {
			this.panelEncounterLiveRegion.show(new LiveMatches());
			this.panelPlayerRegisteredRegion.show(new RegisteredPlayers());
			this.panelPlayerOnlineRegion.show(new OnlinePlayers());
		},

		_onClickButtonStartNewGame: function() {
			var router = new Backbone.Router();
			router.navigate('board', {trigger: true});
		},

		_onClickButtonLoginPlayer: function() {
			App.module('LoginModule').login();
		},

		_onClickButtonRegisterPlayer: function() {
			App.module('LoginModule').register();
		}


	});

});
