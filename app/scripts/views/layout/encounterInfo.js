define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/encounterInfo_tmpl',
	'../composite/matchInfoContainer'
],
function( Backbone, Communicator, EncounterinfoTmpl, MatchInfoContainer  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {

			_.bindAll(this, '_onShowEncounter', '_onShowMatches');
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._onSocketConnected);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:ENCOUNTER-UPDATED:' + this.options.encounterUid, this._onLoadEncounter);

			var m = {
				    loaded: false,
					home:'',
					guest:'',
					homeSets: 0,
					guestSets: 0,
				}

			this.model = new Backbone.Model(m);
		},

    	template: EncounterinfoTmpl,


    	/* Layout sub regions */
    	regions: {
			ActiveMatches: '.octopus_activeMatchInfo'
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onShow: function () {
			this._onLoadEncounter();
		},

		_onSocketConnected: function () {
			this._onLoadEncounter();
		},


		_onLoadEncounter: function () {
			App.module('SocketModule').GetEncounter(this.options.encounterUid, this._onShowEncounter);
		},



		_onShowEncounter: function (data) {
			var m = {
				loaded: true,
				home: data.home.name,
				guest: data.guest.name,
				homeSets: data.home.matchesWon,
				guestSets: data.guest.matchesWon
			}

			this.model.set(m);
			this.render();

			App.module('SocketModule').GetEncounterMatches(this.options.encounterUid, this._onShowMatches);
		},

		_onShowMatches: function (data) {
			this.ActiveMatches.show(new MatchInfoContainer({
				collection: new Backbone.Collection(data.reverse())
			}));
		}

	});

});
