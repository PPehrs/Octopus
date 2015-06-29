define([
	'backbone',
	'application',
	'communicator',
	'hbs!tmpl/item/mainMenu_tmpl'
],
function( Backbone, App, Communicator, MainmenueTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			this.listenTo(Communicator.mediator, 'DialogModule:LOGGED-IN', this.onLoggedIn);
			this.listenTo(Communicator.mediator, 'DialogModule:LOGGED-OUT', this.onLoggedOut);
		},

    	template: MainmenueTmpl,


    	/* ui selector cache */
    	ui: {
    		MainMenuStartside: '#mmStartside',
			MainMenuDartscorer: '#mmDartscorer',
			MainMenuPlayerProfile: '#mmPlayerProfile',
			MainMenuLogin: '#mmLogin',
			MainMenuLoginText: '#mmLoginText',
			MainMenuRegister: '#mmRegister',
			MainMenuLogout: '#mmLogout'
    	},

		/* Ui events hash */
		events: {
			'click @ui.MainMenuStartside': 'onClickMainMenuStartside',
			'click @ui.MainMenuDartscorer': 'onClickMainMenuDartscorer',
			'click @ui.MainMenuLogin': '_onClickButtonLoginPlayer',
			'click @ui.MainMenuRegister': '_onClickButtonRegisterPlayer',
			'click @ui.MainMenuLogout': '_onClickButtonLogout'
		},

		_onClickButtonLogout: function () {
			App.module('SocketModule').LogOutUser();
		},

		onLoggedOut: function () {
			App.module('LoginModule').logout();
			this.ui.MainMenuLogin.show();
			this.ui.MainMenuLoginText.hide();
			this.ui.MainMenuPlayerProfile.hide();
			this.ui.MainMenuLogout.hide();
		},

		onLoggedIn: function (res) {
			this.ui.MainMenuLoginText.text('Hi, ' + res.data.username);
			this.ui.MainMenuLogin.hide();
			this.ui.MainMenuLoginText.show();
			this.ui.MainMenuPlayerProfile.show();
			this.ui.MainMenuLogout.show();
		},

		_onClickButtonLoginPlayer: function() {
			App.module('LoginModule').login();
		},

		_onClickButtonRegisterPlayer: function() {
			App.module('LoginModule').register();
		},

		onClickMainMenuDartscorer: function () {
			var router = new Backbone.Router();
			router.navigate('board', {trigger: true});
		},

		onClickMainMenuStartside: function() {
			var router = new Backbone.Router();
			router.navigate('', {trigger: true});
		},

		/* on render callback */
		onRender: function() {}
	});

});
