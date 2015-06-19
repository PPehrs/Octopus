define([
	'backbone',
	'backbone.stickit',
	'communicator',
	'hbs!tmpl/item/playerName_tmpl'
],
function( Backbone, Stickit, Communicator, PlayerNameTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: PlayerNameTmpl,

    	/* ui selector cache */
    	ui: {
			InputPlayerName: '.playerName'
		},

		bindings: {
			'.playerName' : 'name'
		},

		/* Ui events hash */
		events: {
			'focusout @ui.InputPlayerName': '_onFocusOutInputPlayerName'
		},

		initialize: function() {
			this.stickit();
 			this.listenTo(this.model, 'change:isPlayerActive', this.onPlayerIsActiveChanged);
		},

		_onFocusOutInputPlayerName: function () {
			debugger
			Communicator.mediator.trigger('playerName:change:name:direct', this.model.toJSON());
		},

		onPlayerIsActiveChanged: function() {
			var isPlayerActive = this.model.get('isPlayerActive');
			if(isPlayerActive) {
				this.triggerMethod('playerName:change:activePlayer', this.model.get('isLeft'));
			}
		},

		/* on render callback */
		onRender: function() {
		}
	});

});

