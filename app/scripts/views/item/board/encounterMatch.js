define([
	'backbone',
	'communicator',
	'bootbox',
	'hbs!tmpl/item/encounterMatch_tmpl',
	'./dialogResult',
	'../../../models/result'
],
function( Backbone, Communicator, Bootbox, EncountermatchTmpl, DialogResult, ResultModel  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: EncountermatchTmpl,


    	/* ui selector cache */
    	ui: {
			ButtonStart: '.btn-start-encouter-match',
			ButtonEnd: '.btn-end-encouter-match',
			ButtonDublicate: '.btn-dublicate-encouter-match',
			ButtonSwitch: '.btn-switch-encouter-match',
			ButtonDelete: '.btn-delete-encouter-match',
			ButtonRecycle: '.btn-recycle-encouter-match',
			ButtonResult: '.btn-result-encouter-match'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickButtonStart',
			'click @ui.ButtonEnd': '_onClickButtonEnd',
			'click @ui.ButtonDublicate': '_onClickButtonDublicate',
			'click @ui.ButtonSwitch': '_onClickButtonSwitch',
			'click @ui.ButtonDelete': '_onClickButtonDelete',
			'click @ui.ButtonRecycle': '_onClickButtonRecycle',
			'click @ui.ButtonResult': '_onClickButtonResult',
		},

		_onClickButtonRecycle: function () {
			this.model.set('done', false);
			this.model.set('started', false);
			this.model.get('player1').legs = 0;
			this.model.get('player2').legs = 0;
			this.model.unset('matchUid');
			this.render();
		},

		_onClickButtonResult: function () {
			var model = new ResultModel();
			model.set({
				p1Name: this.model.get('player1').name,
				p2Name: this.model.get('player2').name,
				p1: this.model.get('player1').legs,
				p2: this.model.get('player2').legs
			});
			var view = new DialogResult({
				model: model,
				callback: this._onResultConfirmed
			});
			App.module('DialogModule').showConfirm('Ergebnis eintragen', view, 'DoCallbackDummy');
		},

		_onResultConfirmed: function (data) {
			this.model.get('player1').legs = Number(data.p1);
			this.model.get('player2').legs = Number(data.p2);
			this.model.set('done', true);

			var matchUid = this.model.get('matchUid');
			if(!matchUid) {
				matchUid = octopus.uuid();
				this.model.set('matchUid', matchUid);
			}

			var data = this.model.toJSON();

			App.module('MatchModule').syncMatchFrom({
				uid: matchUid,
				sets: [],
				activeLeg: null,
				state: null,
				players: [data.player1, data.player2]
			});

			App.module('EncounterController').done(data.uid, data.player1.legs, data.player2.legs);

			setTimeout(function() {
				Communicator.mediator.trigger('encounterMatch:match:ready');
			});
		},

		_onClickButtonDublicate: function () {
			var m = _.clone(this.model.toJSON());
			m.player1.legs = 0;
			m.player2.legs = 0;
			var newMatch = {
				uid: octopus.uuid(),
				p1: m.player1,
				p2: m.player2
			}
			debugger
			App.module('EncounterController').add(newMatch);
			Communicator.mediator.trigger('dialogEncounterMatch:encounter:confirmed');
		},

		_onClickButtonSwitch: function () {
			var m = _.clone(this.model.toJSON());
			this.model.set('player1', m.player2);
			this.model.set('player2', m.player1);
			this.render();
		},

		_onClickButtonDelete: function () {
			var m = _.clone(this.model.toJSON());
			var deleteMatch = {
				uid: m.uid
			}
			App.module('EncounterController').delete(deleteMatch);
			Communicator.mediator.trigger('dialogEncounterMatch:encounter:confirmed');
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
			this.model.set('done', true);

			App.module('EncounterController').done();

			setTimeout(function() {
				Communicator.mediator.trigger('encounterMatch:match:ready');
			});

			this.render();
		},

		_startNewMatch: function () {
			this.model.set('started', true);

			App.module('EncounterController').started(this.model.toJSON());

			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			App.module('PlayerController').savePlayer(octopusStore.activeEncounterMatch.player1);
			App.module('PlayerController').savePlayer(octopusStore.activeEncounterMatch.player2);

			var self = this;
			Communicator.mediator.trigger('encounterMatch:match:start', this.model.get('uid'));
			setTimeout(function() {
				Communicator.mediator.trigger('encounterMatch:match:start', self.model.get('uid'));
			});

			this.listenToOnce(Communicator.mediator, 'match:started:' +  this.model.get('uid'), this._onMatchStarted);
			this.render();
		},

		_onMatchStarted: function (matchUid) {
			this.model.set('matchUid', matchUid);
			App.module('EncounterController').dependencyToMatch(this.model.get('uid') ,matchUid);
		},

		_check: function () {
			var wonLegs = App.module('EncounterController').check(this.model.toJSON());
			if(wonLegs) {
				this.model.get('player1').legs = wonLegs.p1Legs;
				this.model.get('player2').legs = wonLegs.p2Legs;;

				this.render();
			}
		},

		initialize: function () {
			_.bindAll(this, '_onResultConfirmed');

			this.listenTo(Communicator.mediator, 'matchModule:check', this._check);
			if(!this.model.get('player1').legs) {
				this.model.get('player1').legs = 0;
			}
			if(!this.model.get('player2').legs) {
				this.model.get('player2').legs = 0;
			}
			var started = this.model.get('started');
			var done = this.model.get('done');

			this.model.set('started', (typeof started === 'undefined'?false:started));
			this.model.set('done', (typeof done === 'undefined'?false:done));
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
