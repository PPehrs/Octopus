define([
		'backbone',
		'hbs!tmpl/item/liveMatch_tmpl'
	],
	function( Backbone, LiveMatchTmpl  ) {
		'use strict';

		/* Return a ItemView class definition */
		return Backbone.Marionette.ItemView.extend({

			template: LiveMatchTmpl,


			/* ui selector cache */
			ui: {
				MatchContainer: '.octopus_liveMatch_container'
			},

			/* Ui events hash */
			events: {
				'click @ui.MatchContainer': 'onClickMatchContainer'
			},

			onClickMatchContainer: function () {
				var router = new Backbone.Router();
				var id = this.model.get('fkMatch');
				router.navigate('match/' + id, {trigger: true});
			},

			initialize: function () {
				_.bindAll(this, 'onShowEncounter' );
				var players = this.model.get('players')
				var m = {
					isEncounter: false,
					home: '',
					guest: '',
					homeSets: '',
					guestSets: '',
					p1Name: (players && players.length > 0 )?players[0].name:'',
					p1Legs: (players && players.length > 0 )?(players[0].legs?players[0].legs:0):'',
					p2Name: (players && players.length > 1 )?players[1].name:'',
					p2Legs: (players && players.length > 0 )?(players[1].legs?players[1].legs:0):''
				};

				this.model.set(m);
			},

			/* on render callback */
			onRender: function() {
			},

			onShow: function () {
				var fkEncounter = this.model.get('fkEncounter');

				if(fkEncounter) {
					App.module('SocketModule').GetEncounter(fkEncounter, this.onShowEncounter);
				}
			},

			onShowEncounter: function (data) {
				this.model.set({
					isEncounter: true,
					home: data.home.name,
					guest: data.guest.name,
					homeSets: data.home.matchesWon,
					guestSets: data.guest.matchesWon
				})
				this.render();
			}
		});

	}
);
