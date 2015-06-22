define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/matchInfo_tmpl',
	'views/composite/match/matchInfoScores'
],
function( Backbone, Communicator, MatchinfoTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {

			_.bindAll(this, '_onLoadMatch' ,'_onShowEncounter');
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._onSocketConnected);

			var m = {
					isEncounter: false,
					home:'',
					guest:'',
					homeSets: 0,
					guestSets: 0,
					p1Name: '',
					p2Name: '',
					p1Legs: 0,
					p2Legs: 0
				}

			this.model = new Backbone.Model(m);
		},

    	template: MatchinfoTmpl,


    	/* Layout sub regions */
    	regions: {
			Player1ActiveLeg: '.player1_matchInfoScores',
			Player2ActiveLeg: '.player1_matchInfoScores'
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			var p1 = this.model.get('p1');
			var p2 = this.model.get('p2');

			if(p1) {
				//debugger
			}

			if(p2) {
				//debugger

			}

		},

		onShow: function () {
			this._ticker();
		},

		_onSocketConnected: function () {
			this._ticker();
		},

		_ticker: function () {
			if(!this.isDestroyed) {
				var self = this;
				App.module('SocketModule').GetMatch(this.options.matchUid, this._onLoadMatch);
				setTimeout(function () {
					self._ticker();
				}, 5000)
			}
		},

		_onLoadMatch: function (data) {
			var m = {
				p1Name: data.players[0].name,
				p2Name: data.players[1].name,
				p1Legs: data.players[0].legs,
				p2Legs: data.players[1].legs,
				p1: data.players[0],
				p2: data.players[1],
				activeLeg: data.activeLeg
			}

			this.model.set(m);
			this.render();

			if(data.fkEncounter) {
				App.module('SocketModule').GetEncounter(data.fkEncounter, this._onShowEncounter);
			}
		},

		_onShowEncounter: function (data) {
			var m = {
				isEncounter: true,
				home: data.home[0].name,
				guest: data.guest[0].name,
				homeSets: data.home[0].matchesWon,
				guestSets: data.guest[0].matchesWon
			}

			this.model.set(m);
			this.render();
		}
	});

});
