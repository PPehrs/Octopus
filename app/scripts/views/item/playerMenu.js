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
    		SwitchPlayernames: '.switchPlayernames'
    	},
 
		/* Ui events hash */
		events: {
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
			var isLeftCheck = this.model.get('isLeftCheck');

			var wonWith = 0;
			var legsWon = 0;
			var showInfo = false;

			if(countLegs) {
				if(isLeft) {
					legsWon = this.model.get('left').legsWon;
					if(isLeftCheck) {
						showInfo = true;
						wonWith = this.model.get('left').darts;
					}
				} else {
					legsWon = this.model.get('right').legsWon;
					if(!isLeftCheck) {
						showInfo = true;
						wonWith = this.model.get('right').darts;
					}
				}
			}

			this.ui.WonLegs.html(legsWon);

			if(showInfo) {
				this.ui.WonLegs.tooltipster({
                	content: $(
                		'<span>' + countLegs +'. Leg gewonnen<br><strong>' + wonWith + ' Darts</strong></span>'
                	)
            	});
            	
			}
		}
	});

});
