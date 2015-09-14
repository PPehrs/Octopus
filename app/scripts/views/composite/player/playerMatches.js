define([
		'backbone',
		'communicator',
		'hbs!tmpl/composite/liveMatches_tmpl',
		'views/item/player/playerMatch'
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


			onShow: function () {
				this._loadMatches(this.options.matches);
			},

			_loadMatches: function (data) {
				data = _.sortBy(data, function(data){ return data.createdDateTime; }).reverse();
				this.collection = new Backbone.Collection(data);
				this.render();
			}
		});

	});

