define([
	'backbone',
	'tooltipster',
	'hbs!tmpl/item/playerScore_tmpl'
],
function( Backbone, Tooltip, PlayerScoreTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Playerscore ItemView");
		},

    	template: PlayerScoreTmpl,


    	/* ui selector cache */
    	ui: {
    		ScoreTextDiv: '.scoreText div',
    		ScoreTextSpan: '.scoreText span',
    		ScoreText: '.scoreText',
    		ScoreInput: '.scoreInput'
    	},

		/* Ui events hash */
		events: {
			'click @ui.ScoreText': '_onClickScoreText',
			'focusout @ui.ScoreInput': '_onFocusOutScoreInput',
			'keydown @ui.ScoreInput': '_onKeyDownScoreInput'
		},

		setNewScore: function(isNewScore) {
			this.ui.ScoreInput.hide();
			this.ui.ScoreTextDiv.show();
			if(isNewScore) {
				var val = Number(this.ui.ScoreInput.val());
				if(!_.isNumber(val)) {
					val = 0;
				}
				this.ui.ScoreText.val(this.ui.ScoreTextSpan.html(this.ui.ScoreInput.val()));
				this.triggerMethod('playerScore:change:value', Number(val), this.model.get('uid'));
			}
		},

		_onKeyDownScoreInput: function(e) {
			if (e.keyCode === 13) {
				this.setNewScore(true);
			} else if (e.keyCode === 27) {
				this.setNewScore(false);
			}
		},

		_onFocusOutScoreInput: function() {
			this.setNewScore(true);
		},

		_onClickScoreText: function() {
			if(!this.model.get('uid')) {
				return;
			}

			this.ui.ScoreTextDiv.hide();
			this.ui.ScoreInput.show();
			this.ui.ScoreInput.val(this.ui.ScoreTextSpan.html());
			this.ui.ScoreInput.focus();
		},

		/* on render callback */
		onRender: function() {
			if(this.model.get('uid')) {
				this.ui.ScoreText.tooltipster({
	            	content: $(
	            		'<span>Klick zum &Auml;ndern des Scores</span>'
	            	)
	        	});
			}
		}
	});

});
