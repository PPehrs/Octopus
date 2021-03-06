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
			this.listenTo(Communicator.mediator, 'CHALLENGE:REQUEST', this._onChallengeRequest);
			this.listenTo(Communicator.mediator, 'CHALLENGE:ACCEPT', this._onChallengeAccept);
			this.listenTo(Communicator.mediator, 'CHALLENGE:REFUSE', this._onChallengeRefuse);
			this.listenTo(Communicator.mediator, 'ONLINE:MATCH:START',  this._onStartOnlineMatch);
			this.listenTo(Communicator.mediator, 'CHALLENGE:ANSWER:WAIT',  this._onWaitForAnswer);
			this.listenTo(Communicator.mediator, 'ONLINE:MATCH:CANCELED', this._onOnlineMatchCanceled);
		},

    	template: MainmenueTmpl,


    	/* ui selector cache */
    	ui: {
			ChallengeAction: '.challenge-action-btn',
			GlobalAlert:'.bb-alert',
			ChallengeRequestInfo: '.octopus-challenge-request-info',
    		MainMenuStartside: '#mmStartside',
			MainMenuDartscorer: '#mmDartscorer',
			MainMenuPlayerProfile: '#mmPlayerProfile',
			MainMenuLogin: '#mmLogin',
			MainMenuLoginText: '#mmLoginText',
			MainMenuRegister: '#mmRegister',
			MainMenuLogout: '#mmLogout',
			MainMenuCheckout: '#mmCheckout',
			MainMenuImpressum: '#mmImpressum',
			ChallengeRequestTimer: '.challenge-request-timer',
			ChallengeRequestRefuse: '.challenge-request-refuse',
			ChallengeRequestAccept: '.challenge-request-accept'
    	},

		/* Ui events hash */
		events: {
			'click @ui.MainMenuImpressum': 'onClickMainMenuImpressum',
			'click @ui.MainMenuStartside': 'onClickMainMenuStartside',
			'click @ui.MainMenuDartscorer': 'onClickMainMenuDartscorer',
			'click @ui.MainMenuLogin': '_onClickButtonLoginPlayer',
			'click @ui.MainMenuRegister': '_onClickButtonRegisterPlayer',
			'click @ui.MainMenuLogout': '_onClickButtonLogout',
			'click @ui.MainMenuPlayerProfile': '_onClickButtonPlayerProfile',
			'click @ui.MainMenuCheckout': '_onClickButtonCheckOut',
			'click @ui.ChallengeRequestRefuse': '_onClickButtonRefuse',
			'click @ui.ChallengeRequestAccept': '_onClickButtonAccept'
		},

		interval: null,
		challengeData: null,

		onDestroy: function () {
			window.clearInterval(_self.interval);
		},

		_onWaitForAnswer: function (data) {
			var lm = App.module('LoginModule');
			if(lm.onWaitForAnswer) {
				this.ui.ChallengeRequestInfo.html('<div style="font-size:14px">Warte auf Antwort von ' + data.username + '</div><div><b>90</b></div>');
				this.ui.ChallengeAction.hide();
				this.ui.GlobalAlert.show();
				var _self = this;
				var t = 90;
				this.interval = setInterval(function () {
					if(t === -1) {
						_self._onChallengeRefuse(data);
					} else {
						_self.ui.ChallengeRequestInfo.html('<div style="font-size:14px">Warte auf Antwort von ' + data.username + '</div><div><b>' + t + '</b></div>');
						t = t-1;
					}
				}, 1000);
			}
		},

		_onStartOnlineMatch: function (data) {
			if(Backbone.history.location.href.indexOf('#board') === -1) {
				var router = new Backbone.Router();
				router.navigate('board', {trigger: true});
			}

			var i = 0;
			while(Backbone.history.location.href.indexOf('#board') === -1) {
				i += 1;
				if(i > 100000) {
					return;
				}
			}

			Communicator.mediator.trigger('ONLINE:MATCH:START:ONBOARD', data);
		},

		_onClickButtonRefuse: function () {
			this.ui.GlobalAlert.hide();
			window.clearInterval(this.interval);
			var sm = App.module('SocketModule');
			sm.ChallengeRefuse(this.challengeData)
			this.challengeData = null;
		},

		_onClickButtonAccept: function () {
			this.ui.GlobalAlert.hide();
			window.clearInterval(this.interval);
			var sm = App.module('SocketModule');
			sm.ChallengeAccept(this.challengeData);
			this.challengeData = null;
		},

		_onOnlineMatchCanceled: function () {
			this.ui.ChallengeAction.hide();
			this.ui.ChallengeRequestInfo.html('<div class="fz15">vom Gegner beendet <i style="color:red" class="fa fa-ban"></i></div>');
			this.ui.GlobalAlert.show();
			var _self = this;
			setTimeout(function () {
				_self.ui.GlobalAlert.hide();
			}, 5000);
		},

		_onChallengeRefuse: function (data) {
			var lm = App.module('LoginModule');
			lm.onWaitForAnswer = false;
			window.clearInterval(this.interval);

			this.ui.ChallengeAction.hide();
			this.ui.ChallengeRequestInfo.html(data.username + '<div>abgelehnt <i style="color:red" class="fa fa-ban"></i></div>');
			this.ui.GlobalAlert.show();
			var _self = this;
			setTimeout(function () {
				_self.ui.GlobalAlert.hide();
			}, 5000);
		},

		_onChallengeAccept: function (data) {
			var lm = App.module('LoginModule');
			lm.onWaitForAnswer = false;
			window.clearInterval(this.interval);

			this.ui.ChallengeAction.hide();
			this.ui.ChallengeRequestInfo.html(data.username + '<div>angenommen <i style="color:green" class="fa fa-check-circle"></i></div>');
			this.ui.GlobalAlert.show();
			var _self = this;
			setTimeout(function () {
				_self.ui.GlobalAlert.hide();
			}, 5000);
		},

		_onChallengeRequest: function (data) {
			var lm = App.module('LoginModule');
			if(lm.onWaitForAnswer) {
				return;
			}

			this.ui.ChallengeAction.show();
			if(this.challengeData ) {
				return;
			}

			this.challengeData = data;
			this.ui.ChallengeRequestInfo.text(data.nameFrom);
			$(this.ui.ChallengeRequestTimer[0]).text('90');
			this.ui.GlobalAlert.show();
			var _self = this;
			this.interval = setInterval(function () {
				var txt = $(_self.ui.ChallengeRequestTimer[0]).text();
				var nbr = Number(txt) - 1;
				if(nbr === -1) {
					this.challengeData = null;
					var sm = App.module('SocketModule');
					sm.ChallengeRefuse(_self.challengeData);
					window.clearInterval(_self.interval);
					_self.ui.GlobalAlert.hide();
				} else {
					_self.ui.ChallengeRequestTimer.text(nbr);
				}
			}, 1000);
		},

		_onClickButtonCheckOut: function() {
			var router = new Backbone.Router();
			router.navigate('check', {trigger: true});
		},

		_onClickButtonPlayerProfile: function () {
			if(App.module('LoginModule').isLoggedIn()) {
				var router = new Backbone.Router();
				var userId = App.module('LoginModule').loggedInUserId();
				router.navigate('profile/' + userId, {trigger: true});
			}
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

		onClickMainMenuImpressum: function () {
			var router = new Backbone.Router();
			router.navigate('impressum', {trigger: true});
		},

		onClickMainMenuStartside: function() {
			var router = new Backbone.Router();
			router.navigate('', {trigger: true});
		},

		/* on render callback */
		onRender: function() {}
	});

});
