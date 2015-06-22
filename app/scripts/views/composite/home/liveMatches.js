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
				_.bindAll(this, '_onLoadLiveMatches');
			},

			/* on render callback */
			onRender: function() {
				this.listenTo(Communicator.mediator, 'APP:SOCKET:MATCH-UPDATED', this._loadLiveMatches);
				this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._loadLiveMatches);
			},


			onShow: function () {
				this._ticker();
			},

			_ticker: function () {
				var self = this;
				if(!self.isDestroyed) {
					self._loadLiveMatches();
					setTimeout(function () {
						self._ticker();
					}, 30000)
				}
			},

			_loadLiveMatches: function () {
				App.module('SocketModule').GetLiveMatches(this._onLoadLiveMatches);
			},

			_onLoadLiveMatches: function (data) {
				data = _.sortBy(data, function(data){ return data.startDateTime; }).reverse();
				this.collection = new Backbone.Collection(data);
				this.render();
			}
		});

	});

