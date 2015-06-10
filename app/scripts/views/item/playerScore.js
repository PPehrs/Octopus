define([
	'backbone',
	'hbs!tmpl/item/playerScore_tmpl'
],
function( Backbone, PlayerScoreTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Playerscore ItemView");
		},
		
    	template: PlayerScoreTmpl,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
