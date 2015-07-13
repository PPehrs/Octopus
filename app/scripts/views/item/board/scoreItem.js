define([
	'backbone',
	'tooltipster',
	'hbs!tmpl/item/scoreItem_tmpl'
],
function( Backbone, Tooltip, ScoreitemTmpl  ) {
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
    		confirmScoreCheckButtons: '.confirmScoreButtons.ooCheck'
    	},

		/* Ui events hash */
		events: {
			'click @ui.checkButton': 'onClickCheckButton',
			'click @ui.missButton': 'onClickMissButton',

			'click @ui.enterButton': 'onClickEnterButton',
			'click @ui.strgZButton': 'onClickStrgZButton',

			'keydown @ui.scoreInput': 'onKeyDownScoreInput',
			'keypress @ui.scoreInput': 'onKeyPressScoreInput',
			'keyup @ui.scoreInput': 'onKeyUpScoreInput'
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
			var value = this.ui.scoreInput.val();
			var checkDart = $(e.target).data('id');
			var missedDarts = 0;
			if(checkDart == '3.') {
				if(this.miss == 3) {
					missedDarts = 2;
				}
				else if(this.miss == 2) {
					missedDarts = 1;
				}
			}
			else if(checkDart == '2.') {
				if(this.miss == 3) {
					missedDarts = 1;
				}
			}
			this.triggerMethod('scoreItem:new:score', value, missedDarts, checkDart);
			this.ui.scoreInput.val('');
			this.focusInput();
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
