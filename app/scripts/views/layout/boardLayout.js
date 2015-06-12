define([
	'backbone',
	'backbone.marionette',
	'application',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'./playerLayout',
	'../item/scoreItem'
],
function( Backbone, Marionette, BoardlayoutTmpl, PlayerLayout, ScoreItem  ) {
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
    	ui: {
			CheckBoxTransmit: '#chkTransmit'
		},

		/* Ui events hash */
		events: {},

		childEvents: {
			'scoreItem:new:score': function (child, value) {
				this._onNewScore(value);
			}
		},

		_onNewScore: function (value) {
			var isPlayerLeftActive = this.matchStatus.isPlayerLeftActive
			var activePlayer = this.ScorePlayerLeft.currentView;
			if(!isPlayerLeftActive) {
				activePlayer = this.ScorePlayerRight.currentView;
			}
			activePlayer.newScore(value);

			var active = !isPlayerLeftActive;
			this.ScorePlayerLeft.currentView.model.set('isPlayerActive', active);
			this.ScorePlayerRight.currentView.model.set('isPlayerActive', !active);
			this.matchStatus.isPlayerLeftActive = active;

			this.ScorePlayerLeft.currentView.refresh();
			this.ScorePlayerRight.currentView.refresh();
		},

		_startNewMatch: function () {
			var matchUuid = octopus.uuid.v4();

			this.matchStatus = {
				uuid: matchUuid,
				playerLeftStartsLeg: true,
				playerLeftStartsSet: true,
				playerLeftStartsMatch: true,
				isPlayerLeftActive: true
			};
		},

		/* on render callback */
		onRender: function() {
			this.ui.CheckBoxTransmit.bootstrapSwitch();

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
