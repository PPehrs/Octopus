define([
	'backbone',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'../item/scoreItem'
],
function( Backbone, BoardlayoutTmpl, ScoreItem  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

		initialize: function() {
			console.log("initialize a Boardlayout Layout");
		},
		
    	template: BoardlayoutTmpl,
    	

    	/* Layout sub regions */
    	regions: {
    		ScoreRegion: '#octopus_score',
    		ScorePlayer: '#octopus_player'
    	},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			this.ScoreRegion.show(new ScoreItem({}));
		}
	});

});
