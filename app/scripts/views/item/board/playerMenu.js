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


    	/* ui selector cache */
    	ui: {
    		ActivePlayer: '.activePlayer',
    		WonLegs: '.wonLegs',
			WonLegsEdit: '.wonLegsEdit',
    		SwitchPlayernames: '.switchPlayernames',
    		Alert: '.bb-alert',
    		AlertText: '.bb-alert span',
    	},

		/* Ui events hash */
		events: {
			'click @ui.ActivePlayer': '_onClickActivePlayer',
			'click @ui.SwitchPlayernames': '_onClickSwitchPlayernames',
			'click @ui.WonLegs': '_onClickWonLegs',
			'focusout @ui.WonLegsEdit':  '_onLostFocusWonLegsEdit'
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
