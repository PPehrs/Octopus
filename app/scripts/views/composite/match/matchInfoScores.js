define([
	'backbone',
	'hbs!tmpl/composite/matchInfoScores_tmpl',
	'views/item/match/matchInfoScore'
],
function( Backbone, MatchinfoscoresTmpl, MatchInfoScore  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

		initialize: function() {
			console.log("initialize a Matchinfoscores CompositeView");
		},


    	template: MatchinfoscoresTmpl,


    	/* ui selector cache */
    	ui: {},

		childView: MatchInfoScore,

    	/* where are we appending the items views */
    	childViewContainer: ".octopus_matchInfoScore",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
