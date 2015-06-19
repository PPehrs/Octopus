define([
	'backbone',
	'communicator',
	'hbs!tmpl/item/playerName_tmpl'
],
function( Backbone, Communicator, PlayerNameTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: PlayerNameTmpl,

    	/* ui selector cache */
    	ui: {
			InputPlayerName: '.playerName'
		},

		/* Ui events hash */
		events: {
			'focusout @ui.InputPlayerName': '_onFocusOutInputPlayerName'
		},

		_onFocusOutInputPlayerName: function () {
			this.model.set('name', this.ui.InputPlayerName.val());
			var playerNameModel = this.model.toJSON();
			delete playerNameModel.isPlayerActive;
			Communicator.mediator.trigger('playerName:change:name:direct', playerNameModel);
		},

		/* on render callback */
		onRender: function() {
			this.ui.InputPlayerName.val(this.model.get('name'));

			if(App.module('MatchModule').match) {
				var isLeft = this.model.get('isLeft');
				var isPlayerLeftActive = App.module('MatchModule').match.state.isPlayerLeftActive;
				var isPlayerActive = isLeft?isPlayerLeftActive:!isPlayerLeftActive;
				this.model.set('isPlayerActive', isPlayerActive);
			}
		}
	});

});

