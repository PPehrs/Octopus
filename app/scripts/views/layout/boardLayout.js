define([
	'backbone',
	'backbone.marionette',
	'bootbox',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'./playerLayout',
	'../item/scoreItem'
],
function( Backbone, Marionette, Bootbox, BoardlayoutTmpl, PlayerLayout, ScoreItem  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		matchModule: App.module('MatchModule'),

    	template: BoardlayoutTmpl,

    	/* Layout sub regions */
    	regions: {
    		ScoreRegion: '#octopus_score',
    		ScorePlayerLeft: '#octopus_playerLeft',
    		ScorePlayerRight: '#octopus_playerRight'
    	},

    	/* ui selector cache */
    	ui: {
			CheckBoxTransmit: '#chkTransmit',

			ButtonNewMatch:  '#btnNewMatch'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonNewMatch': '_onClickNewMatch'
		},

		childEvents: {
			'scoreItem:new:score': function (child, value) {
				this._onNewScore(value);
			}
		},

		_onClickNewMatch: function () {
			var self = this;
			if(this.matchModule.started) {
				Bootbox.confirm('Aktuelles Match verwerfen und neues starten?', function (result) {
					if (result) {
						self.matchModule.stop();
						self._startNewMatch();
					}
				});
			} else {
				self._startNewMatch();
			}
		},

		_onNewScore: function (value) {
			var isPlayerLeftActive = this.matchModule.matchStatus.isPlayerLeftActive
			var activePlayer = this.ScorePlayerLeft.currentView;
			if(!isPlayerLeftActive) {
				activePlayer = this.ScorePlayerRight.currentView;
			}
			activePlayer.newScore(value);

			var active = !isPlayerLeftActive;
			this.ScorePlayerLeft.currentView.model.set('isPlayerActive', active);
			this.ScorePlayerRight.currentView.model.set('isPlayerActive', !active);
			this.matchModule.matchStatus.isPlayerLeftActive = active;

			this.ScorePlayerLeft.currentView.refresh();
			this.ScorePlayerRight.currentView.refresh();
		},

		_startNewMatch: function () {
			this.matchModule.start();
			var playerLeft = {
				isLeft: true,
				isPlayerActive: true
			};

			var playerRight = {
				isLeft: false,
				isPlayerActive: false
			};
			this.ScorePlayerLeft.show(new PlayerLayout({
				model: new Backbone.Model (playerLeft)
			}));
			this.ScorePlayerRight.show(new PlayerLayout({
				model: new Backbone.Model (playerRight)
			}));
		},

		/* on render callback */
		onRender: function() {
			this.ui.CheckBoxTransmit.bootstrapSwitch();

			//---------------------------------------------
			this._startNewMatch();
			//---------------------------------------------

			this.ScoreRegion.show(new ScoreItem({}));
		}
	});

});
