define([
	'backbone',
	'tooltipster',
	'hbs!tmpl/item/playerMenu_tmpl'
],
function( Backbone, Tooltip, PlayermenuTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Playermenu ItemView");
		},

    	template: PlayermenuTmpl,


    	/* ui selector cache */
    	ui: {
    		ActivePlayer: '.activePlayer',
    		WonLegs: '.wonLegs',
    		SwitchPlayernames: '.switchPlayernames',
    		Alert: '.bb-alert',
    		AlertText: '.bb-alert span',
    	},

		/* Ui events hash */
		events: {
			'click @ui.ActivePlayer': '_onClickActivePlayer',
			'click @ui.SwitchPlayernames': '_onClickSwitchPlayernames'
		},

		_onClickSwitchPlayernames: function () {
			this.triggerMethod('playerMenu:switch:names');
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

			var isLeft = this.model.get('isLeft');
			var countLegs = this.model.get('countLegs');


			var wonWith = 0;
			var legsWon = 0;
			var showInfo = false;
			var totalWon = [];


			if(countLegs) {
				if(isLeft) {
					legsWon = this.model.get('left').legsWon;
					var checked = _.last(this.model.get('left').darts).checked;
					totalWon = _.pluck(_.where(this.model.get('left').darts, {checked:true}), 'darts');					
					if(checked) {
						showInfo = true;
						wonWith = _.last(this.model.get('left').darts).darts;
					}
				} else {
					legsWon = this.model.get('right').legsWon;
					var checked = _.last(this.model.get('right').darts).checked;
					totalWon = _.pluck(_.where(this.model.get('right').darts, {checked:true}), 'darts');					
					if(checked) {
						showInfo = true;
						wonWith = _.last(this.model.get('right').darts).darts;
					}
				}
			}

			this.ui.WonLegs.html(legsWon);

			if(showInfo) {
				var self = this;
				this.ui.AlertText.text(wonWith + " Darts");
				this.ui.Alert.fadeIn('slow','swing',function() {
					setTimeout(function() {
						self.ui.Alert.fadeOut('slow', 'swing');	
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
		}
	});

});
