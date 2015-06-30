define([
	'backbone',
	'hbs!tmpl/composite/matchInfoContainer_tmpl',
	'../layout/matchInfo'
],
function( Backbone, MatchinfocontainerTmpl, MatchInfo  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

    	template: MatchinfocontainerTmpl,


    	/* ui selector cache */
    	ui: {},

		childView: MatchInfo,

    	/* where are we appending the items views */
		childViewContainer: '.octopus_encounterMatchInfos',

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
