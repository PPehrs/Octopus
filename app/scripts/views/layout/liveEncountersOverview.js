define([
	'backbone',
	'hbs!tmpl/layout/liveEncountersOverview_tmpl',
	'../composite/home/liveMatches'
],
function( Backbone, LiveencountersoverviewTmpl, LiveMatches  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Liveencountersoverview Layout");
		},

    	template: LiveencountersoverviewTmpl,


    	/* Layout sub regions */
    	regions: {
			EncountersOverview: '#octopus_live_encounters_overview'
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			this.EncountersOverview.show(new LiveMatches());
		}
	});

});
