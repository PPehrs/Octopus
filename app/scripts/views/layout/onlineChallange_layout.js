define([
	'backbone',
	'hbs!tmpl/layout/onlineChallange_layout_tmpl',
	'../composite/home/onlinePlayers',
	'./chat_layout'
],
function( Backbone, OnlineChallangeLayoutTmpl, OnlinePlayers, Chat  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		ui: {
			ButtonClose: '.octopus_computer_opponoment_close'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonClose': '_onClickButtonClose'
		},

		/* Layout sub regions */
		regions: {
			panelPlayerOnlineRegion: '#panelPlayerOnlineRegion',
			panelAllPlayersChats: '#panelAllPlayersChats'
		},

    	template: OnlineChallangeLayoutTmpl,

		/* on render callback */
		onRender: function() {
			this.panelPlayerOnlineRegion.show(new OnlinePlayers());
			this.panelAllPlayersChats.show(new Chat());
		},

		_onClickButtonClose: function () {
			this.options.parent.hideComputerOpponent();
		},
	});

});
