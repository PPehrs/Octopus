define([
	'backbone',
	'communicator',
	'hbs!tmpl/composite/registeredPlayers_tmpl',
	'views/item/home/registeredPlayer'
],
function( Backbone, Communicator, RegisteredplayersTmpl, RegisteredPlayer  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({


    	template: RegisteredplayersTmpl,

		childView: RegisteredPlayer,

		/* where are we appending the items views */
		childViewContainer: "#octopus_registeredPlayers",

		emptyView: Backbone.Marionette.ItemView.extend({
			template: _.template('<div><i class="fa fa-spin fa-spinner m-r"></i>Registrierte Spieler werden geladen</div>')
		}),

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		initialize: function () {
			_.bindAll(this, '_onLoadRegisteredUsers');
		},

		/* on render callback */
		onRender: function() {
			this.listenTo(Communicator.mediator, 'APP:SOCKET:USER-REGISTERED', this._loadRegisteredUsers);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._loadRegisteredUsers);
		},

		onShow: function () {
			this._loadRegisteredUsers();
		},

		_loadRegisteredUsers: function () {
			App.module('SocketModule').GetRegisteredUser(this._onLoadRegisteredUsers);
		},

		_onLoadRegisteredUsers: function (data) {
			this.collection = new Backbone.Collection(data);
			this.render();
		},
	});

});
