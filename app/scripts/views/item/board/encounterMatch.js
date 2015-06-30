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
			ButtonDublicate: '.btn-dublicate-encouter-match',
			ButtonSwitch: '.btn-switch-encouter-match',
			ButtonDelete: '.btn-delete-encouter-match'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickButtonStart',
			'click @ui.ButtonEnd': '_onClickButtonEnd',
			'click @ui.ButtonDublicate': '_onClickButtonDublicate',
			'click @ui.ButtonSwitch': '_onClickButtonSwitch',
			'click @ui.ButtonDelete': '_onClickButtonDelete',
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

			Communicator.mediator.trigger('encounterMatch:match:start');
			setTimeout(function() {
				Communicator.mediator.trigger('encounterMatch:match:start');
			});

			this.render();
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
