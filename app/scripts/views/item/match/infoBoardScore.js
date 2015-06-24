define([
	'backbone',
	'hbs!tmpl/item/infoBoardScore_tmpl'
],
function( Backbone, InfoboardscoreTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Infoboardscore ItemView");
		},

    	template: InfoboardscoreTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
