define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/matchInfo_tmpl',
	'./infoBoard'
],
function( Backbone, Communicator, MatchinfoTmpl, InfoBoard  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			if(!this.options.matchUid) {
				this.options.matchUid = this.model.get('fkMatch');
			}
			_.bindAll(this, '_onLoadMatch');
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._onSocketConnected);

			var m = {
					p1Name: '',
					p2Name: '',
					p1Legs: 0,
					p2Legs: 0
				}

			this.model = new Backbone.Model(m);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:MATCH-UPDATED:' + this.options.matchUid, this._newMatchData);
		},

    	template: MatchinfoTmpl,


    	/* Layout sub regions */
    	regions: {
			MatchActiveLeg: '.octopus_matchInfoScoresActiveLeg'
		},

		/* on render callback */
		onRender: function() {
			var activeLeg = this.model.get('activeLeg');
			if(!_.isEmpty(activeLeg)) {
				this.MatchActiveLeg.show(new InfoBoard({model: this.model}));
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
				App.module('SocketModule').GetMatch(this.options.matchUid, this._onLoadMatch);
			}
		},

		_newMatchData: function () {
			App.module('SocketModule').GetMatch(this.options.matchUid, this._onLoadMatch);
		},

		_onLoadMatch: function (data) {

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
				_.extend(m, res);
			}

			this.model.set(m);

			this.render();
		}
	});

});
