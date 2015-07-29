define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/onlineChallange_layout_tmpl',
	'../composite/home/onlinePlayers',
	'./chat_layout'
],
function( Backbone, Communicator, OnlineChallangeLayoutTmpl, OnlinePlayers, Chat  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		ui: {
			ButtonClose: '.octopus_computer_opponoment_close',
			Video: '#octopus-callenge-video',
			PrivateChat: '#octopus-callenge-private-chat',
			OnlinePlayers: '#octopus-callenge-online-players',
			CloseMatch: '.octopus_online_challenge_close'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonClose': '_onClickButtonClose',
			'click @ui.CloseMatch': '_onClickMatchClose',
		},

		/* Layout sub regions */
		regions: {
			panelPlayerOnlineRegion: '#panelPlayerOnlineRegion',
			panelAllPlayersChats: '#panelAllPlayersChats',
			panelPrivateChat: '#panelPrivateChat'
		},

    	template: OnlineChallangeLayoutTmpl,

		initialize: function () {
			this.listenTo(Communicator.mediator, 'ONLINE:MATCH:CANCELED', this._close);
		},

		_onClickMatchClose: function () {
			var om = App.module('OnlineController').get();
			localStorage.removeItem('om');
			this._close();
			App.module('SocketModule').ChallengeCanceled(om);
		},

		_close: function () {
			this.ui.OnlinePlayers.show();
			this.panelPlayerOnlineRegion.show(new OnlinePlayers());
			this.ui.CloseMatch.hide();
			this.ui.Video.hide();
			this.ui.PrivateChat.hide();
			App.module('PlayerController').removeOther();
		},

		/* on render callback */
		onRender: function() {
			this.panelAllPlayersChats.show(new Chat());

			var om = App.module('OnlineController').get();
			if(om) {
				this.ui.OnlinePlayers.hide();
				this.ui.CloseMatch.show();
				this.ui.Video.show();
				this.ui.PrivateChat.show();
				this.panelPrivateChat.show(new Chat({
					onlineMatch: om
				}));
			} else {
				this.ui.OnlinePlayers.show();
				this.panelPlayerOnlineRegion.show(new OnlinePlayers());
				this.ui.CloseMatch.hide();
				this.ui.Video.hide();
				this.ui.PrivateChat.hide();
			}
		},

		_onClickButtonClose: function () {
			this.options.parent.hideComputerOpponent();
		},
	});

});
