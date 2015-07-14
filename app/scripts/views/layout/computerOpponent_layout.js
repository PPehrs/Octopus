define([
	'backbone',
	'hbs!tmpl/layout/computerOpponent_layout_tmpl'
],
function( Backbone, ComputeropponentLayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

		initialize: function() {
			console.log("initialize a ComputeropponentLayout Layout");
		},
		
    	template: ComputeropponentLayoutTmpl,
    	

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
