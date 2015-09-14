define([
		'backbone',
		'moment',
		'hbs!tmpl/item/playerMatch_tmpl'
	],
	function( Backbone, Moment, LiveMatchTmpl   ) {
		'use strict';

		/* Return a ItemView class definition */
		return Backbone.Marionette.ItemView.extend({

			template: LiveMatchTmpl,

			matchUid: null,

			/* ui selector cache */
			ui: {
				MatchContainer: '.octopus__open_match'
			},

			/* Ui events hash */
			events: {
				'click @ui.MatchContainer': 'onClickMatchContainer'
			},

			onClickMatchContainer: function () {
				var router = new Backbone.Router();
				router.navigate('match/' + this.matchUid, {trigger: true});
			},

			initialize: function () {
				var data = this.model.attributes;
				this.matchUid = data.uid;

				var m = {
					p1Name: data.players[0].name,
					p2Name: data.players[1].name,
					p1Legs: data.players[0].legs?data.players[0].legs:0,
					p2Legs: data.players[1].legs?data.players[1].legs:0,
					p1: data.players[0],
					p2: data.players[1],
					activeLeg: data.activeLeg,
					hasLegs: false
				}

				if(!_.isEmpty(data.sets)) {
					m.hasLegs = true;
					var res = App.module('StatisticController').calculateTotal(data);
					m.p1Legs = res.lData.checks,
					m.p2Legs = res.rData.checks,
					_.extend(m, res);
				}

				this.model.set(m);
			},



			/* on render callback */
			onRender: function() {
			},

			onShow: function () {

			}
		});

	}
);
