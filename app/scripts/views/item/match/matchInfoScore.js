define([
	'backbone',
	'hbs!tmpl/item/matchInfoScore_tmpl'
],
function( Backbone, MatchinfoscoreTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Matchinfoscore ItemView");
		},

    	template: MatchinfoscoreTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
