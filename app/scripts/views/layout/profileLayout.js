define([
	'backbone',
	'hbs!tmpl/layout/profileLayout_tmpl'
],
function( Backbone, ProfilelayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Profilelayout Layout");
		},

    	template: ProfilelayoutTmpl,


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
