define([
	'backbone',
	'communicator',
	'tooltipster',
	'hbs!tmpl/item/playerMenu_tmpl'
],
function( Backbone, Communicator, Tooltip, PlayermenuTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: PlayermenuTmpl,

		initialize: function () {
			this.model.set({
				tDarts: 0,
				ave: 0.0,
				dbl: 0.0,
				isShowInfo: false,
				wonWithText: ''
			})

			this.listenTo(Communicator.mediator, 'playerName:change:name:direct', this._render);
			this.listenTo(Communicator.mediator, 'playerName:player:unset', this._unset);
		},

		_render: function () {
			this.model.set('isRegisteredUser', false);
			this.model.set('isComp', false);
			var p = _.findWhere(App.module('PlayerController').players, {isLeft: this.model.get('isLeft')});
			if(p) {
				if (p.fkUser) {
					this.model.set('isRegisteredUser', true);
				} else if (p.comp) {
					this.model.set('isComp', true);
				}
			}
			this.render();
		},

		_unset: function () {
			this.model.set({
				ave: "0.0",
				dbl: "0.0",
				isComp: false,
				isRegisteredUser: false,
				isShowInfo: false,
				tDarts: 0,
				wonWithText: ""
			});
			this.render();
		},


    	/* ui selector cache */
    	ui: {
    		ActivePlayer: '.activePlayer',
    		WonLegs: '.wonLegs',
			WonLegsEdit: '.wonLegsEdit',
    		SwitchPlayernames: '.switchPlayernames',
    		Alert: '.bb-alert',
    		AlertText: '.bb-alert span',
			StatisticCheck: '.match-statistic-check',
			StatisticAvg: '.match-statistic-avg',
			StatisticDarts: '.match-statistic-darts',
			RegisteredUser: '.registeredUser',
			CompUser: '.compUser'
    	},

		/* Ui events hash */
		events: {
			'click @ui.ActivePlayer': '_onClickActivePlayer',
			'click @ui.SwitchPlayernames': '_onClickSwitchPlayernames',
			'click @ui.WonLegs': '_onClickWonLegs',
			'focusout @ui.WonLegsEdit':  '_onLostFocusWonLegsEdit'
		},

		setStats : function (tDarts, ave, dbl) {
			this.model.set({
				tDarts: tDarts,
				ave: Number(ave).toFixed(1),
				dbl: Number(dbl).toFixed(1)
			})
			this.render();
		},

		_onClickWonLegs: function () {
			return 'not implemented';
			this.ui.WonLegs.hide();
			this.ui.WonLegsEdit.val(this.model.get('legsWon'));
			this.ui.WonLegsEdit.show();
			this.ui.WonLegsEdit.focus();
			this.ui.WonLegsEdit.select();
		},

		_onLostFocusWonLegsEdit: function () {
			return 'not implemented'
			var newVal = this.ui.WonLegsEdit.val();
			var oldVal = this.model.get('legsWon');
			if($.isNumeric(newVal)) {
				if(Number(newVal) != oldVal) {
					this.ui.WonLegs.text(newVal);
					this.model.set('legsWon', Number(newVal));
				}
			}
			this.ui.WonLegs.show();
			this.ui.WonLegsEdit.hide();
		},

		_onClickSwitchPlayernames: function () {
			Communicator.mediator.trigger('playerMenu:switch:names', this._parentLayoutView());
		},

		_onClickActivePlayer: function () {
			this.triggerMethod('playerMenu:player:active', this.model.get('isLeft'));
		},

		/* on render callback */
		onRender: function() {
			this.ui.SwitchPlayernames.tooltipster({
            	content: $(
            		'<span>Spielernamen tauschen</span>'
            	)
        	});

			this.ui.ActivePlayer.tooltipster({
            	content: $(
            		'<span>Dieser Spieler steht am Oche und muss werfen</span>'
            	)
        	});

			this.ui.RegisteredUser.tooltipster({
				content: $(
					'<span>Registrierter Spieler</span>'
				)
			});

			this.ui.CompUser.tooltipster({
				content: $(
					'<span>Computer-Gegner</span>'
				)
			});

			var isLeft = this.model.get('isLeft');
			var countLegs = this.model.get('countLegs');


			var wonWith = 0;
			var legsWon = 0;
			var showInfo = false;
			var totalWon = [];

			if(countLegs) {
				legsWon = this.model.get('legsWon');
				var checked = _.last(this.model.get('darts')).checked;
				totalWon = _.pluck(_.where(this.model.get('darts'), {checked:true}), 'darts');
				var endOf = this.model.get('endOf');
				if(checked && endOf) {
					this.model.set('endOf', false);
					showInfo = true;
					wonWith = _.last(this.model.get('darts')).darts;
				}
			}

			this.ui.WonLegs.text(legsWon);

			if(showInfo) {
				this.model.set('isShowInfo', true);
				var self = this;
				this.model.set('wonWithText', wonWith + " Darts");
				this.ui.Alert.fadeIn('slow','swing',function() {
					setTimeout(function() {
						self.model.set('wonWithText', '');
						self.model.set('isShowInfo', false);
						if(typeof self.ui.Alert.fadeOut === 'function') {
							self.ui.Alert.fadeOut('slow', 'swing');
						}
					}, 5000);

				});
			}

			if(!_.isEmpty(totalWon)) {
				this.ui.WonLegs.tooltipster({
                	content: $(
                		'<span><strong>' + totalWon.join(', ') + '</strong> Darts</span>'
                	)
            	});
			}
			this.model.set('isRegisteredUser', false);
			this.model.set('isComp', false);
			var p = _.findWhere(App.module('PlayerController').players, {isLeft: this.model.get('isLeft')});
			if(p) {
				if (p.fkUser) {
					this.model.set('isRegisteredUser', true);
				} else if (p.comp) {
					this.model.set('isComp', true);
				}
			}
		}
	});

});
