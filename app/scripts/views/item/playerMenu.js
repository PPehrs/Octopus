define([
	'backbone',
	'hbs!tmpl/item/playerMenu_tmpl'
],
function( Backbone, PlayermenuTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Playermenu ItemView");
		},
		
    	template: PlayermenuTmpl,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
