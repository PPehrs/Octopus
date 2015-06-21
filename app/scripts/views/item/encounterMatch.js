define([
	'backbone',
	'communicator',
	'bootbox',
	'hbs!tmpl/item/encounterMatch_tmpl'
],
function( Backbone, Communicator, Bootbox, EncountermatchTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: EncountermatchTmpl,


    	/* ui selector cache */
    	ui: {
			ButtonStart: '.btn-start-encouter-match',
			ButtonEnd: '.btn-end-encouter-match',
			DublicateEnd: '.btn-dublicate-encouter-match'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickButtonStart',
			'click @ui.ButtonEnd': '_onClickButtonEnd',
			'click @ui.DublicateEnd': '_onClickButtonEnd',
		},

		_onClickButtonStart: function () {
			var self = this;
			var matchModule = App.module('MatchModule');
			if(matchModule.started && matchModule.match && matchModule.match.started) {
				Bootbox.confirm('Aktuelles Match verwerfen und neues starten?', function (result) {
					if (result) {
						self._startNewMatch();
					}
				});
			} else {
				self._startNewMatch();
			}
		},

		_onClickButtonEnd: function () {
			var matchModule = App.module('MatchModule');
			matchModule.stop();

			this.model.set('done', true);

			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			var encounterMatch = _.findWhere(octopusStore.encounterMatches, {uid:octopusStore.activeEncounterMatch.uid});
			encounterMatch.done = true;
			octopusStore.activeEncounterMatch = {};
			localStorage.setItem('octopus', JSON.stringify(octopusStore));

			this.ui.ButtonEnd.hide();
			setTimeout(function() {
				Communicator.mediator.trigger('encounterMatch:match:ready');
			});

		},

		_startNewMatch: function () {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			octopusStore.activeEncounterMatch = this.model.toJSON();
			localStorage.setItem('octopus', JSON.stringify(octopusStore));

			octopusStore.activeEncounterMatch.player1.isLeft = true;
			octopusStore.activeEncounterMatch.player2.isLeft = false;
			
			App.module('PlayerController').savePlayer(octopusStore.activeEncounterMatch.player1);
			App.module('PlayerController').savePlayer(octopusStore.activeEncounterMatch.player2);

			this.ui.ButtonEnd.show();
			Communicator.mediator.trigger('encounterMatch:match:start');
		},

		_check: function () {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(!_.isEmpty(octopusStore.activeEncounterMatch)) {
				if(octopusStore.activeEncounterMatch.uid === this.model.get('uid')) {

					var lcheck = 0;
					var rcheck = 0;
					var matchModule = App.module('MatchModule');
					_.each(matchModule.match.sets, function(aSet) {
						_.each(aSet.legs, function(aLeg) {
							var aCheck = _.find(aLeg.entries, function (entry) {
								return entry.check > 0;
							} )

							if(!_.isEmpty(aCheck) && aCheck.isLeft) {
								lcheck += 1;
							} else if(!_.isEmpty(aCheck) && !aCheck.isLeft) {
								rcheck += 1;
							}

						});
					});

					var players = App.module('PlayerController').players;
					var encounterMatch = _.findWhere(octopusStore.encounterMatches, {uid:octopusStore.activeEncounterMatch.uid});

					_.each(players, function (player) {
						var wonLegs = player.isLeft?lcheck:rcheck;
						if(player.uid === encounterMatch.player1.fkTeamPlayer) {
							encounterMatch.player1.legs = wonLegs;
						} else if(player.uid === encounterMatch.player2.fkTeamPlayer) {
							encounterMatch.player2.legs = wonLegs;
						}
					});

					this.model.get('player1').legs = encounterMatch.player1.legs;
					this.model.get('player2').legs = encounterMatch.player2.legs;
					localStorage.setItem('octopus', JSON.stringify(octopusStore));
					this.render();
				}
			};
		},

		initialize: function () {
			this.listenTo(Communicator.mediator, 'matchModule:check', this._check);
			if(!this.model.get('player1').legs) {
				this.model.get('player1').legs = 0;
			}
			if(!this.model.get('player2').legs) {
				this.model.get('player2').legs = 0;
			}
		},

		/* on render callback */
		onRender: function() {
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(!_.isEmpty(octopusStore.activeEncounterMatch)) {
				if(octopusStore.activeEncounterMatch.uid === this.model.get('uid')) {
					this.ui.ButtonEnd.show();
				}
			};
		}
	});

});
