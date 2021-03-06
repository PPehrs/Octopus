define([
	'backbone',
	'tooltipster',
	'communicator',
	'hbs!tmpl/item/scoreItem_tmpl'
],
function( Backbone, Tooltip, Communicator, ScoreitemTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		check: false,
		miss: 0,

		checkWith: {
			F1: false,
			F2: false,
			F3: false
		},

		checkDart: -1,

		scoreInputOldValue: '',

    	template: ScoreitemTmpl,


    	/* ui selector cache */
    	ui: {
    		CheckText: '#ooCheckText',
    		MissText: '#xxMissText',
    		strgZButton: '#btnCtrlZ',
    		scoreInput: '#octopus_score_input',
    		scoreText: '#octopus_score_text',
    		checkButton: '.oo_btn',
    		missButton: '.xx_btn',
    		enterButton: '#btnEnter',
    		confirmScoreButtons: '.confirmScoreButtons',
    		confirmScoreCheckButtons: '.confirmScoreButtons.ooCheck',
			inputHelper: '.inputHelper',
			secondInput: '#secondInput',
			inputHelperInDiv: '.inputHelperIn div'
    	},

		/* Ui events hash */
		events: {
			'click @ui.inputHelperInDiv': 'onClickInputHelperInDiv',
			'click @ui.secondInput': 'onClickInputHelper',
			'click @ui.checkButton': 'onClickCheckButton',
			'click @ui.missButton': 'onClickMissButton',

			'click @ui.enterButton': 'onClickEnterButton',
			'click @ui.strgZButton': 'onClickStrgZButton',

			'keydown @ui.scoreInput': 'onKeyDownScoreInput',
			'keypress @ui.scoreInput': 'onKeyPressScoreInput',
			'keyup @ui.scoreInput': 'onKeyUpScoreInput'
		},

		onClickInputHelperInDiv: function (e) {
			var txt = $(e.target).text();
			var num = $.isNumeric(txt);
			if(num) {
				var itxt = this.ui.scoreInput.val();
				this.ui.scoreInput.val(itxt + txt);
			} else {
				var ele = $(e.currentTarget).find('.fa-trash-o');
				if(ele.length > 0) {
					this.ui.scoreInput.val('');
					return;
				}
				var ele = $(e.currentTarget).find('.fa-backward');
				if(ele.length > 0) {
					var txtT = this.ui.scoreInput.val();
					if(txtT.length > 0) {
						txtT = txtT.substring(0, txtT.length - 1);
						this.ui.scoreInput.val(txtT);
						return;
					}
				}
			}
		},

		onClickInputHelper: function () {
			this.ui.inputHelper.toggle('slow');
		},

		showCheckButton: function(pos) {
			$(this.ui.checkButton[pos]).css('pointer-events', 'auto');
			$(this.ui.checkButton[pos]).css('display', 'inline');
		},

		showMissButton: function(pos) {
			$(this.ui.missButton[pos]).css('pointer-events', 'auto');
			$(this.ui.missButton[pos]).css('display', 'inline');

		},

		hideConfirmButton: function() {
			this.check = false;
			this.ui.checkButton.css('pointer-events', 'none');
			this.ui.checkButton.css('display', 'none');
			this.ui.missButton.css('pointer-events', 'none');
			this.ui.missButton.css('display', 'none');
			this.ui.confirmScoreButtons.hide();

			this.checkWith.F1 = false;
			this.checkWith.F2 = false;
			this.checkWith.F3 = false;
		},

		canCheck: function(canCheck) {
			this.ui.CheckText.html('Check<i class="m-l-vs fa fa-info-circle"></i>');
			this.checkDart = -1;
			$(this.ui.checkButton[0]).text('1.');
			$(this.ui.checkButton[1]).text('2.');
			$(this.ui.checkButton[2]).text('3.');
			this.ui.checkButton.removeClass('oo_btn_miss');


			if(canCheck) {
				this.check = true;
				this.miss = 0;
				this.hideConfirmButton();
				if(canCheck >= 1) {
					this.showCheckButton(2);
					this.showMissButton(0);
					this.miss = 1;
					this.ui.confirmScoreCheckButtons.css('margin-left', '-83px');
					this.checkWith.F3 = true;
				}
				if(canCheck >= 2) {
					this.showCheckButton(1);
					this.showMissButton(1);
					this.miss = 2;
					this.checkWith.F2 = true;
				}
				if(canCheck === 3) {
					this.showCheckButton(0);
					this.showMissButton(2);
					this.miss = 3;
					this.ui.confirmScoreCheckButtons.css('margin-left', '-113px');
					this.checkWith.F1 = true;
				}
				this.ui.confirmScoreButtons.show();
			} else {
				this.check = false;
				this.miss = 0;
				this.hideConfirmButton();
			}
		},

		focusInput: function() {
			var self = this;
			setTimeout(function(){
				self.ui.scoreInput.focus();
			})
		},

		onClickCheckButton: function(e) {
			var txt = this.ui.CheckText.text();

			var activePlayerRest = App.module('MatchModule').activePlayerRest;

			if(txt[0] === 'M') {
				var value = this.ui.scoreInput.val();
				var missedDarts = Number($(e.target).text());
				this.triggerMethod('scoreItem:new:score', value, missedDarts, this.checkDart);
				this.ui.scoreInput.val('');
				this.focusInput();
			} else {

				var value = this.ui.scoreInput.val();
				var checkDart = $(e.target).data('id');
				var missedDarts = 0;
				var trigger = false;
				if (checkDart === '3.') {
					if (this.miss === 1) {
						trigger = true;
					} else if (this.miss === 3) {
						if((activePlayerRest <= 40 && activePlayerRest >= 2) || activePlayerRest === 50) {
							if((activePlayerRest % 2) === 0) {
								missedDarts = 2;
								trigger = true;
							} else {
								missedDarts = 1;
								trigger = true;
							}
						}
					}
				}
				else if (checkDart === '2.') {
					if (this.miss === 2) {
						trigger = true;
					} else if (this.miss === 3) {
						if((activePlayerRest <= 40 && activePlayerRest >= 2) || activePlayerRest === 50) {
							if((activePlayerRest % 2) === 0) {
								missedDarts = 1;
								trigger = true;
							} else {
								missedDarts = 0;
								trigger = true;
							}
						}
					}
				}
				else if (checkDart == '1.') {
					trigger = true;
				}

				if (trigger) {
					this.triggerMethod('scoreItem:new:score', value, missedDarts, checkDart);
					this.ui.scoreInput.val('');
					this.focusInput();
				} else {
					this.checkDart = checkDart;
					this.ui.CheckText.html('Miss<i class="m-l-vs fa fa-info-circle"></i>');
					this.ui.checkButton.addClass('oo_btn_miss');

					if (this.miss === 3) {
						$(this.ui.checkButton[0]).text('0');
						$(this.ui.checkButton[1]).text('1');
						$(this.ui.checkButton[2]).text('2');
					}
					if (this.miss === 2) {
						$(this.ui.checkButton[1]).text('0');
						$(this.ui.checkButton[2]).text('1');
					}
				}
			}
		},

		onClickMissButton: function(e) {
			var value = this.ui.scoreInput.val();
			if(value || !this._parentLayoutView().missNeedsValue()) {
				var missedDarts = $(e.target).data('id');
				this.triggerMethod('scoreItem:new:score', value, missedDarts);
				this.ui.scoreInput.val('');
				this.focusInput();
			} else {
				this.ui.scoreInput.val('0?');
				this.ui.scoreInput.focus();
				this.ui.scoreInput.select();
			}
		},

		onClickEnterButton: function() {
			var value = this.ui.scoreInput.val();
			this.triggerMethod('scoreItem:new:score', value, this.miss>0?this.miss:null);
			this.ui.scoreInput.val('');
			this.focusInput();
		},

		onClickStrgZButton: function() {
			this.triggerMethod('scoreItem:undo:score');
		},

		onKeyDownScoreInput: function(e) {

			if(this.canCheck) {
				if(e.ctrlKey && (e.keyCode >= 112  && e.keyCode <= 114)) {
					e.preventDefault();
					if(e.keyCode === 114 && !this.checkWith.F1) e.keyCode = 113;
					if(e.keyCode === 113 && !this.checkWith.F2) e.keyCode = 112;
					if(e.keyCode === 112 && !this.checkWith.F3) return;
					this.ui.missButton[e.keyCode - 112].click();
					return false;
				}
				if(e.keyCode >= 112  && e.keyCode <= 114) {
					e.preventDefault();
					if(e.keyCode === 112 && !this.checkWith.F1) e.keyCode = 113;
					if(e.keyCode === 113 && !this.checkWith.F2) e.keyCode = 114;
					if(e.keyCode === 114 && !this.checkWith.F3) return;
					this.ui.checkButton[e.keyCode - 112].click();
					return false;
				}
			}

			if(e.ctrlKey && e.keyCode === 89) {
				this.triggerMethod('scoreItem:redo:score');
				return false;
			}

			if(e.ctrlKey && e.keyCode === 90) {
				this.triggerMethod('scoreItem:undo:score');
				return false;
			}

			var value = e.target.value;
			if(Number(value) > 180) {
				e.target.value = this.scoreInputOldValue;
				return false;
			}
			this.scoreInputOldValue = e.target.value;
		},

		onKeyPressScoreInput: function(e) {
			if(e.keyCode > 57 || (e.keyCode >= 41 && e.keyCode <= 46)) {
				return false;
			}
		},

		onKeyUpScoreInput: function(e) {
			var value = e.target.value;

			if(Number(value) > 180) {
				e.target.value = this.scoreInputOldValue;
			}

			if(e.keyCode === 13) {
				this.triggerMethod('scoreItem:new:score', e.target.value);
				e.target.value = null;
				return;
			}
		},

		initialize: function () {
			this.listenTo(Communicator.mediator, 'comp:score:new', this.onCompNewScore);
		},

		tries : 0,

		onCompNewScore: function (val, comp) {
			var cc = App.module('CompController');

			var activePlayerRest = App.module('MatchModule').activePlayerRest;
			var afterActivePlayerRest =  activePlayerRest - val;

			var yo = {};
			var missedDarts = null;
			var checkDart = null;

			if(activePlayerRest > 170) {
				cc.possi = 0;
			} else {
				yo = cc.setCheck(comp, activePlayerRest, this.miss, val);
				missedDarts = yo.miss;
				val = yo.score;
				if(yo.check) {
					if(this.miss === 3) {
						checkDart = (yo.miss + 1) + '.';
					} else if(this.miss === 2) {
						checkDart = (yo.miss + 2) + '.';
					} else {
						checkDart = '3.';
					}
				}
			}


			this.ui.scoreInput.val(val);

			var _self = this;
			setTimeout(function() {
				if(checkDart) {
					_self.triggerMethod('scoreItem:new:score', 0, missedDarts, checkDart);
				} else {
					_self.triggerMethod('scoreItem:new:score', val, missedDarts);
				}
				_self.ui.scoreInput.val(null);
			}, 1000)
		},

		/* on render callback */
		onRender: function() {
			this.ui.CheckText.tooltipster({
            	content: $(
            		'<span>Eingabe des getroffenen Doppel in [Score Eingabe] und klick hier (oder <strong>F1 / F2 / F3)</strong></span>'
            	),
            	position: 'bottom'
        	});

			this.ui.MissText.tooltipster({
            	content: $(
            		'<span>Fehlversuche auf Doppel in diesem Wurf.<br>Geworfenen Score eingeben und klick hier (oder <strong>Strg-F1 / Strg-F2 / Strg-F3)</strong></span>'
            	),
            	position: 'bottom'
        	});

			this.ui.strgZButton.tooltipster({
            	content: $(
            		'<span>Letzte Eingabe l&ouml;schen klick hier (oder <strong> Strg-Z)</strong></span>'
            	)
        	});

			this.ui.enterButton.tooltipster({
            	content: $(
            		'<span>Eingabe best&auml;tigen klick hier (oder <strong> Enter)</strong></span>'
            	)
        	});

		},
	});

});
