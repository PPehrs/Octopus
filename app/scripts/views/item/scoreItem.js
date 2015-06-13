define([
	'backbone',
	'hbs!tmpl/item/scoreItem_tmpl'
],
function( Backbone, ScoreitemTmpl  ) {
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
			'click @ui.enterButton': 'onClickEnterButton',
			'click @ui.strgZButton': 'onClickStrgZButton',

			'keydown @ui.scoreInput': 'onKeyDownScoreInput',
			'keypress @ui.scoreInput': 'onKeyPressScoreInput',
			'keyup @ui.scoreInput': 'onKeyUpScoreInput'
		},

		onClickEnterButton: function() {
			var value = this.ui.scoreInput.val();
			this.triggerMethod('scoreItem:new:score', value);
			this.ui.scoreInput.val('');
		},

		onClickStrgZButton: function() {
			this.triggerMethod('scoreItem:undo:score');
		},

		onKeyDownScoreInput: function(e) {

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
		onRender: function() {},
	});

});
