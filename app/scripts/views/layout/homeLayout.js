define([
	'backbone',
	'backbone.marionette',
	'bootbox',
	'hbs!tmpl/layout/homeLayout_tmpl',
	'../composite/registeredPlayers',
	'../item/dialogRegister',
	'../item/dialogLogin',
	'modules/dialogModule'
],
function( Backbone, Marionette, Bootbox, HomelayoutTmpl, RegisteredPlayers, DialogRegister, DialogLogin, DialogModule ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Homelayout Layout");
		},

    	template: HomelayoutTmpl,


    	/* Layout sub regions */
    	regions: {
			panelPlayerRegisteredRegion: '#panelPlayerRegisteredRegion'
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
