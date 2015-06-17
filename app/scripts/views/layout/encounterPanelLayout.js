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

		/* on render callback */
		onRender: function() {
			this.listenTo(Communicator.mediator, 'dialogEncounter:encounter:confirmed', this.onEncounterConfirmed);
			this.listenTo(Communicator.mediator, 'dialogEncounterMatch:encounter:confirmed', this.onEncounterMatchConfirmed);

			this.onEncounterMatchConfirmed();
		},

		onShow: function() {
		}
	});

});
