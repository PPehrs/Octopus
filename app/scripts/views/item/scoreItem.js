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
    		scoreInput: '#octopus_score_input',
    		scoreText: '#octopus_score_text',
    		checkButton: '.oo_btn'
    	},

		/* Ui events hash */
		events: {
			'keydown @ui.scoreInput': 'onKeyDownScoreInput',
			'keypress @ui.scoreInput': 'onKeyPressScoreInput',
			'keyup @ui.scoreInput': 'onKeyUpScoreInput'
		},

		onKeyDownScoreInput: function(e) {
			var value = e.target.value;
			if(Number(value) > 180) {
				e.target.value = this.scoreInputOldValue;
				return false;
			}
			this.scoreInputOldValue = e.target.value;
		},

		onKeyPressScoreInput: function(e) {
			if(e.keyCode > 57) {
				return false;
			}
		},

		onKeyUpScoreInput: function(e) {
			var value = e.target.value;
			if(Number(value) > 180) {
				e.target.value = this.scoreInputOldValue;
			}
		},

		/* on render callback */
		onRender: function() {}
	});

});
