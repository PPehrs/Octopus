define([
	'backbone',
	'tooltipster',
	'hbs!tmpl/item/scoreItem_tmpl'
],
function( Backbone, Tooltip, ScoreitemTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		scoreInputOldValue: '',

		initialize: function() {
			console.log("initialize a Scoreitem ItemView");
		},

    	template: ScoreitemTmpl,


    	/* ui selector cache */
    	ui: {
    		strgZButton: '#btnStrZ',
    		scoreInput: '#octopus_score_input',
    		scoreText: '#octopus_score_text',
    		checkButton: '.oo_btn',
    		enterButton: '#btnEnter'
    	},

		/* Ui events hash */
		events: {
			'click @ui.checkButton': 'onClickCheckButton',

			'click @ui.enterButton': 'onClickEnterButton',
			'click @ui.strgZButton': 'onClickStrgZButton',

			'keydown @ui.scoreInput': 'onKeyDownScoreInput',
			'keypress @ui.scoreInput': 'onKeyPressScoreInput',
			'keyup @ui.scoreInput': 'onKeyUpScoreInput'
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
			this.triggerMethod('scoreItem:new:score', value, checkDart);
			this.ui.scoreInput.val('');
			this.focusInput();
		},

		onClickEnterButton: function() {
			var value = this.ui.scoreInput.val();
			this.triggerMethod('scoreItem:new:score', value);
			this.ui.scoreInput.val('');
			this.focusInput();
		},

		onClickStrgZButton: function() {
			this.triggerMethod('scoreItem:undo:score');
		},

		onKeyDownScoreInput: function(e) {

			if(e.keyCode >= 112  && e.keyCode <= 114) {
				e.preventDefault();
				this.ui.checkButton[e.keyCode - 112].click();
				return false;
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
			this.ui.checkButton.tooltipster({
            	content: $(
            		'<span>Eingabe des getroffenen Doppel in [Score Eingabe] und klick hier (oder <strong>F1 - F2 - F3)</strong></span>'
            	),
            	position: 'bottom'
        	});

			this.ui.strgZButton.tooltipster({
            	content: $(
            		'<span>Letzte Eingabe l&ouml;schen klick hier (oder <strong> Strg-Z)</strong></span>'
            	)
        	});
        	
		},
	});

});
