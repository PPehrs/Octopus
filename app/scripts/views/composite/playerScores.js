define([
	'backbone',
	'hbs!tmpl/composite/playerScores_tmpl',
	'../item/playerScore'
],
function( Backbone, PlayerScoresTmpl, PlayerScore ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

    	template: PlayerScoresTmpl,


    	/* ui selector cache */
    	ui: {},

    	childView: PlayerScore,

    	/* where are we appending the items views */
    	childViewContainer: "#octopus_playerScore",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
