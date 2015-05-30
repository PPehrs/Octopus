define([
	'backbone',
	'hbs!tmpl/layout/boardLayout_tmpl'
],
function( Backbone, BoardlayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

		initialize: function() {
			console.log("initialize a Boardlayout Layout");
		},
		
    	template: BoardlayoutTmpl,
    	

    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
