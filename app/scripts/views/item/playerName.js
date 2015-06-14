define([
	'backbone',
	'hbs!tmpl/item/playerName_tmpl'
],
function( Backbone, PlayerNameTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Playername ItemView");
		},
		
    	template: PlayerNameTmpl,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		initialize: function() {
 			this.listenTo(this.model, 'change:isPlayerActive', this.onPlayerIsActiveChanged);
		},

		onPlayerIsActiveChanged: function() {
			var isPlayerActive = this.model.get('isPlayerActive');
			if(isPlayerActive) {
				this.triggerMethod('playerName:change:activePlayer', this.model.get('isLeft'));
			}
		},

		/* on render callback */
		onRender: function() {}
	});

});
