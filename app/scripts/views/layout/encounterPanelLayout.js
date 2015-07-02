define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/encounterPanelLayout_tmpl',
	'../composite/board/encounterMatches'
],
function( Backbone, Communicator, EncounterpanellayoutTmpl, EncounterMatches  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			this.onLoadEncounter();
		},

		ui: {
			ButtonDublicate: '.btn-dublicate-encouter-match'
		},

		events: {
			'click @ui.ButtonDublicate': 'onDublicate'
		},

		regions: {
			ActiveEncounterMatchesRegion: '#octopus_activeEncounterMatches'
		},

    	template: EncounterpanellayoutTmpl,

		onDublicate: function () {
			var p1U = _.uniqueId('u_');
			var p2U = _.uniqueId('u_');
			var newMatch = {
				uid: octopus.uuid(),
				p1: {
					name: this.model.get('home').name,
					legs: 0,
					uid: p1U,
					fkTeamPlayer: p1U,
					fkUser: -1,
					isHome: true
				},
				p2: {
					name: this.model.get('guest').name,
					legs: 0,
					uid: p2U,
					fkTeamPlayer: p2U,
					fkUser: -1,
					isHome: false
				}
			}
			App.module('EncounterController').add(newMatch);
			Communicator.mediator.trigger('dialogEncounterMatch:encounter:confirmed');
		},

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
					home: {
						matchesWon: octopusStore.activeEncounter.home.matchesWon,
						fkTeam: octopusStore.activeEncounter.home.fkTeam,
						name: octopusStore.activeEncounter.home.name
					},
					guest: {
						matchesWon: octopusStore.activeEncounter.guest.matchesWon,
						fkTeam: octopusStore.activeEncounter.guest.fkTeam,
						name: octopusStore.activeEncounter.guest.name
					}
				})
			}
		},

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
			if(octopusStore.activeEncounter) {
				octopusStore.activeEncounter.home.matchesWon = home;
				octopusStore.activeEncounter.guest.matchesWon = guest;
				this.model.get('home').matchesWon = home;
				this.model.get('guest').matchesWon = guest;
				localStorage.setItem('octopus', JSON.stringify(octopusStore));
			}
			this.render();

			App.module('SocketModule').UpdateOrCreateEncounter(this.model);
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
