define([
	'backbone',
	'hbs!tmpl/composite/encounterMatches_tmpl',
	'../item/encounterMatch'
],
function( Backbone, EncountermatchesTmpl, EncounterMatch  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

		initialize: function() {
			console.log("initialize a Encountermatches CompositeView");
		},
		
    	
    	template: EncountermatchesTmpl,
    	

    	/* ui selector cache */
    	ui: {},

    	childView: EncounterMatch,

    	/* where are we appending the items views */
    	childViewContainer: "#octopus_encounterMatch",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
