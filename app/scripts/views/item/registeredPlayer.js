define([
	'backbone',
	'hbs!tmpl/item/registeredPlayer_tmpl'
],
function( Backbone, RegisteredplayerTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: RegisteredplayerTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
