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

		/* on render callback */
		onRender: function() {}
	});

});
