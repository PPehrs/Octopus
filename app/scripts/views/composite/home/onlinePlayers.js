define([
	'backbone',
	'communicator',
	'hbs!tmpl/composite/onlinePlayers_tmpl',
	'views/item/home/onlinePlayer'
],
function( Backbone, Communicator, OnlineplayersTmpl, OnlinePlayer  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({


    	template: OnlineplayersTmpl,

		childView: OnlinePlayer,

		/* where are we appending the items views */
		childViewContainer: "#octopus_onlinePlayers",

		emptyView: Backbone.Marionette.ItemView.extend({
			template: _.template('<div><i class="fa fa-spin fa-spinner m-r"></i>Online Spieler werden geladen</div>')
		}),

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		initialize: function () {
			_.bindAll(this, '_onLoadOnlineUsers');
		},

		/* on render callback */
		onRender: function() {
			this.listenTo(Communicator.mediator, 'APP:SOCKET:USER-LOGGED-IN', this._loadOnlineUsers);
			this.listenTo(Communicator.mediator, 'DialogModule:LOGGED-OUT', this._loadOnlineUsers);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._loadOnlineUsers);
		},

		onShow: function () {
			this._loadOnlineUsers();
		},

		_loadOnlineUsers: function () {
			App.module('SocketModule').GetLoggedInUser(this._onLoadOnlineUsers);
		},

		_onLoadOnlineUsers: function (data) {
			this.collection = new Backbone.Collection(data);
			this.render();
		},
	});

});
