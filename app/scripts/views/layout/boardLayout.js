define([
	'backbone',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'./playerLayout',
	'../item/scoreItem'
],
function( Backbone, BoardlayoutTmpl, PlayerLayout, ScoreItem  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		matchStatus: null,

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

		childEvents: {
			'scoreItem:new:score': function (value) {
				alert('DIGGI');
			}
		},

		_startNewMatch: function () {
			this.matchStatus = {
				playerLeftStartsLeg: true,
				playerLeftStartsSet: true,
				playerLeftStartsMatch: true,
				isplayerLeftActive: true
			};
		},

		/* on render callback */
		onRender: function() {
			//---------------------------------------------
			this._startNewMatch();

			var playerLeft = {
				isLeft: true,
				isPlayerActive: true
			};

			var playerRight = {
				isLeft: false,
				isPlayerActive: false
			};
			//---------------------------------------------

			this.ScoreRegion.show(new ScoreItem({}));
			this.ScorePlayerLeft.show(new PlayerLayout({
				model: new Backbone.Model (playerLeft)
			}));
			this.ScorePlayerRight.show(new PlayerLayout({
				model: new Backbone.Model (playerRight)
			}));
		}
	});

});
