define([
	'backbone',
	'hbs!tmpl/item/encounterMatch_tmpl'
],
function( Backbone, EncountermatchTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({
		
    	template: EncountermatchTmpl,
        

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
