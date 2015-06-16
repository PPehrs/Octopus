define([
	'backbone',
	'backbone.marionette',
	'bootbox',
	'hbs!tmpl/layout/homeLayout_tmpl',

	'../composite/registeredPlayers',
	'../composite/liveMatches',

	'../item/dialogRegister',
	'../item/dialogLogin'
],
function( Backbone,
		  Marionette,
		  Bootbox,
		  HomelayoutTmpl,

		  RegisteredPlayers,
		  LiveMatches,

		  DialogRegister,
		  DialogLogin ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Homelayout Layout");
		},

    	template: HomelayoutTmpl,


    	/* Layout sub regions */
    	regions: {
			panelPlayerRegisteredRegion: '#panelPlayerRegisteredRegion',
			panelEncounterLiveRegion: '#panelEncounterLiveRegion'
		},

    	/* ui selector cache */
    	ui: {
    		buttonStartNewGame: '#btnStartNewGame',
    		buttonLoginPlayer: '#btnLoginPlayer',
    		buttonRegisterPlayer: '#btnRegisterPlayer',
    	},

		/* Ui events hash */
		events: {
			'click @ui.buttonStartNewGame': '_onClickButtonStartNewGame',
			'click @ui.buttonLoginPlayer': '_onClickButtonLoginPlayer',
			'click @ui.buttonRegisterPlayer': '_onClickButtonRegisterPlayer'
		},

		/* on render callback */
		onRender: function() {
			this.panelPlayerRegisteredRegion.show(new RegisteredPlayers());
			this.panelEncounterLiveRegion.show(new LiveMatches());
		},

		_onClickButtonStartNewGame: function() {
			var router = new Backbone.Router();
			router.navigate('board', {trigger: true});
		},

		_onClickButtonLoginPlayer: function() {
			App.module('DialogModule').showConfirm('Anmelden', DialogLogin);
		},

		_onClickButtonRegisterPlayer: function() {
			App.module('DialogModule').showConfirm('Registrieren', DialogRegister, 'RegisterUser');
		}


	});

});
