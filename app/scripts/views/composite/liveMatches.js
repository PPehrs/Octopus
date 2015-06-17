define([
		'backbone',
		'communicator',
		'hbs!tmpl/composite/liveMatches_tmpl',
		'../item/liveMatch'
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
				_.bindAll(this, '_onLoadLiveMatches');
			},

			/* on render callback */
			onRender: function() {
				this.listenTo(Communicator.mediator, 'APP:SOCKET:MATCH-UPDATED', this._loadLiveMatches);
				this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._loadLiveMatches);
			},


			onShow: function () {
				this._loadLiveMatches();
			},

			_loadLiveMatches: function () {
				App.module('SocketModule').GetLiveMatches(this._onLoadLiveMatches);
			},

			_onLoadLiveMatches: function (data) {
				var col = [];
				_.each(data, function (d) {
					col.push({
						uid: d
					})
				});
				this.collection = new Backbone.Collection(col);
				this.render();
			},
		});

	});

