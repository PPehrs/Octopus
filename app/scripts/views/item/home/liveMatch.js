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
				var id = this.model.get('fkEncounter');
				router.navigate('encounter/' + id, {trigger: true});
			},

			initialize: function () {
				_.bindAll(this, 'onShowEncounter' );
				var players = this.model.get('players')
				/*var m = {
					isLiveMatch: false,
					home: '',
					guest: '',
					homeSets: '',
					guestSets: '',
					p1Name: (players && players.length > 0 )?players[0].name:'',
					p1Legs: (players && players.length > 0 )?(players[0].legs?players[0].legs:0):'',
					p2Name: (players && players.length > 1 )?players[1].name:'',
					p2Legs: (players && players.length > 0 )?(players[1].legs?players[1].legs:0):''
				};*/
				var d = this.model.toJSON();
				var m = {
					 fkEncounter: d.uid,
					 isLiveMatch: false,
					 home: d.home.name,
					 guest: d.guest.name,
					 homeSets: d.home.matchesWon,
					 guestSets: d.guest.matchesWon,
					 p1Name: '',
					 p1Legs: '',
					 p2Name: '',
					 p2Legs: ''
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
