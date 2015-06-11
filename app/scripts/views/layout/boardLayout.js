define([
	'backbone',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'./playerLayout',
	'../item/scoreItem'
],
function( Backbone, BoardlayoutTmpl, PlayerLayout, ScoreItem  ) {
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
    		ScorePlayerLeft: '#octopus_playerLeft',
    		ScorePlayerRight: '#octopus_playerRight'
    	},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			this.ScoreRegion.show(new ScoreItem({}));
			this.ScorePlayerLeft.show(new PlayerLayout({
				model: new Backbone.Model ({
					isLeft: true,
					isPlayerActive: true
				})
			}));
			this.ScorePlayerRight.show(new PlayerLayout({
				model: new Backbone.Model ({
					isLeft: false,
					isPlayerActive: false
				})
			}));
		}
	});

});
