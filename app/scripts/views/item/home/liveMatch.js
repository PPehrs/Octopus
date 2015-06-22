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
				alert('ui')
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
					p1Legs: (players && players.length > 0 )?players[0].legs:'',
					p2Name: (players && players.length > 1 )?players[1].name:'',
					p2Legs: (players && players.length > 0 )?players[1].legs:''
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
					home: data.home[0].name,
					guest: data.guest[0].name,
					homeSets: data.home[0].matchesWon,
					guestSets: data.guest[0].matchesWon
				})
				this.render();
			}
		});

	}
);
