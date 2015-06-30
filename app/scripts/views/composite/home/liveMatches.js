define([
		'backbone',
		'communicator',
		'hbs!tmpl/composite/liveMatches_tmpl',
		'views/item/home/liveMatch'
	],
	function( Backbone, Communicator, RegisteredplayersTmpl, RegisteredPlayer  ) {
		'use strict';

		/* Return a CompositeView class definition */
		return Backbone.Marionette.CompositeView.extend({


			template: RegisteredplayersTmpl,

			childView: RegisteredPlayer,

			/* where are we appending the items views */
			childViewContainer: "#octopus_liveMatches",

			emptyView: Backbone.Marionette.ItemView.extend({
				template: _.template('<div><i class="fa fa-spin fa-spinner m-r"></i>Matches werden geladen</div>')
			}),

			/* ui selector cache */
			ui: {},

			/* Ui events hash */
			events: {},

			initialize: function () {
				_.bindAll(this, '_onLoadLiveEncounters');
			},

			/* on render callback */
			onRender: function() {
				this.listenTo(Communicator.mediator, 'APP:SOCKET:MATCH-UPDATED', this._loadLiveEncounters);
				this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._loadLiveEncounters);
			},


			onShow: function () {
				this._loadLiveEncounters();
			},

			_loadLiveEncounters: function () {
				App.module('SocketModule').GetLiveEncounters(this._onLoadLiveEncounters);
			},

			_onLoadLiveEncounters: function (data) {
				data = _.sortBy(data, function(data){ return data.createdDateTime; }).reverse();
				this.collection = new Backbone.Collection(data);
				this.render();
			}
		});

	});

