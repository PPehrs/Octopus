define([
	'backbone',
	'hbs!tmpl/layout/playerLayout_tmpl',
	'../item/playerMenu',
	'../item/playerName',
	'../composite/playerScores'
],
function( Backbone, PlayerlayoutTmpl, PlayerMenu, PlayerName, PlayerScores ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

		initialize: function() {
			console.log("initialize a Playerlayout Layout");
		},
		
    	template: PlayerlayoutTmpl,
    	

    	/* Layout sub regions */
    	regions: {
    		PlayerMenuRegion: '.octopus_playerMenu',
    		PlayerNameRegion: '.octopus_playerName',
    		PlayerScoresRegion: '.octopus_playerScores'
    	},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			this.PlayerMenuRegion.show(new PlayerMenu({
				model: this.model
			}))
			this.PlayerNameRegion.show(new PlayerName({
				model: this.model
			}))
			this.PlayerScoresRegion.show(new PlayerScores({
				collection: new Backbone.Collection({
					score: 501,
					isTop: true,
					value: null,
					isLeft: this.model.get('isLeft')
				})
			}))
		}
	});

});
