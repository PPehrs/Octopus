define([
	'backbone',
	'hbs!tmpl/composite/playerScores_tmpl',
	'../item/playerScore'
],
function( Backbone, PlayerScoresTmpl, PlayerScore ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

		initialize: function() {
			console.log("initialize a Playerscores CompositeView");
		},
		
    	
    	template: PlayerScoresTmpl,
    	

    	/* ui selector cache */
    	ui: {},

    	itemView: PlayerScore,

    	/* where are we appending the items views */
    	itemViewContainer: "#octopus_playerScore",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
