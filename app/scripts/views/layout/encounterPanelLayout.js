define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/encounterPanelLayout_tmpl',
	'../composite/encounterMatches'
],
function( Backbone, Communicator, EncounterpanellayoutTmpl, EncounterMatches  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			this.onLoadEncounter();
		},

		regions: {
			ActiveEncounterMatchesRegion: '#octopus_activeEncounterMatches'
		},

    	template: EncounterpanellayoutTmpl,

		onEncounterMatchConfirmed: function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(!_.isEmpty(octopusStore.encounterMatches)) {
				this.ActiveEncounterMatchesRegion.show(new EncounterMatches({
					collection: new Backbone.Collection(octopusStore.encounterMatches)
				}));
			} else {
				this.ActiveEncounterMatchesRegion.empty();
			}
		},

		onEncounterConfirmed: function() {
			this.onLoadEncounter();
			this.render();
		},

		_emptyEncounterModel: function() {
			var home = {
				name: '',
				fkTeam: -1,
				matchesWon: 0
			}
			var guest = {
				name: '',
				fkTeam: -1,
				matchesWon: 0
			}
			this.model = new Backbone.Model({
				uid: null,
				isEncounter: false,
				home: home,
				guest: guest
			})
		},

		onLoadEncounter: function() {
			this._emptyEncounterModel();
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(!_.isEmpty(octopusStore.activeEncounter)) {
				if(!octopusStore.activeEncounter.home.matchesWon) {
					octopusStore.activeEncounter.home.matchesWon = 0;
				}
				if(!octopusStore.activeEncounter.guest.matchesWon) {
					octopusStore.activeEncounter.guest.matchesWon = 0;
				}
				this.model.set({
					isEncounter: true,
					uid: octopusStore.activeEncounter.uid,
					home: octopusStore.activeEncounter.home,
					guest: octopusStore.activeEncounter.guest
				})
			}
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		_onEncounterMatchReady: function () {
			var home = 0;
			var guest = 0;
			var matches = this.ActiveEncounterMatchesRegion.currentView.collection.toJSON();
			_.each(matches, function (match) {
				if(!match.done) {
					return;
				}
				if(match.player1.legs > match.player2.legs) {
					home += 1;
				} else if(match.player1.legs < match.player2.legs) {
					guest += 1;
				}
			});
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.activeEncounter.home.matchesWon = home;
			octopusStore.activeEncounter.guest.matchesWon = guest;
			this.model.get('home').matchesWon = home;
			this.model.get('guest').matchesWon = guest;
			localStorage.setItem('octopus', JSON.stringify(octopusStore));
			this.render();
		},

		/* on render callback */
		onRender: function() {
			this.listenTo(Communicator.mediator, 'dialogEncounter:encounter:confirmed', this.onEncounterConfirmed);
			this.listenTo(Communicator.mediator, 'dialogEncounterMatch:encounter:confirmed', this.onEncounterMatchConfirmed);
			this.listenTo(Communicator.mediator, 'encounterMatch:match:ready', this._onEncounterMatchReady);

			this.onEncounterMatchConfirmed();
		},

		onShow: function() {
		}
	});

});
