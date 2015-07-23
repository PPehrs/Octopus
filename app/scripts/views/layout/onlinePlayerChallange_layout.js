define([
	'backbone',
	'hbs!tmpl/layout/onlinePlayerChallange_layout_tmpl'
],
function( Backbone, OnlinePlayerChallangeLayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		ui: {

		},

		/* Ui events hash */
		events: {

		},

		initialize: function() {
		},

    	template: ComputeropponentLayoutTmpl,


    	/* Layout sub regions */
    	regions: {},

		/* on render callback */
		onRender: function() {
		}
	});

});
