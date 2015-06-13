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
			'scoreItem:new:score': function (child, value, check) {
				this._onNewScore(value, check);
			},
			'scoreItem:undo:score': function (child) {
				this._onUndoScore();
			}
		},

		_onClickNewMatch: function () {
			var self = this;
			if(this.matchModule.started && this.matchModule.match && this.matchModule.match.started) {
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

		_getInActivePlayerView: function() {
			var isPlayerLeftActive = this.matchModule.match.state.isPlayerLeftActive;
			if(!isPlayerLeftActive) {
				return this.ScorePlayerLeft.currentView;
			} else {
				return this.ScorePlayerRight.currentView;
			}
		},

		_getActivePlayerView: function() {
			var isPlayerLeftActive = this.matchModule.match.state.isPlayerLeftActive;
			if(isPlayerLeftActive) {
				return this.ScorePlayerLeft.currentView;
			} else {
				return this.ScorePlayerRight.currentView;
			}
		},

		_switchActivePlayer: function() {
			var isLeftActive = !this.matchModule.match.state.isPlayerLeftActive; //switch active player
			this.ScorePlayerLeft.currentView.model.set('isPlayerActive', isLeftActive);
			this.ScorePlayerRight.currentView.model.set('isPlayerActive', !isLeftActive);
			return isLeftActive;
		},

		_refreshPlayerViews: function() {
			this.ScorePlayerLeft.currentView.refresh();
			this.ScorePlayerRight.currentView.refresh();
		},

		/*
		 *
		 *  +++ NEW SCORE +++ NEW SCORE +++ NEW SCORE +++ NEW SCORE +++
		 *
		 *
		 */
		 _onUndoScore: function() {
		 	var undo = this.matchModule.undoLast();
		 	if(undo) {
		 		var undoPrefix = undo.uid[0];
		 		if(undoPrefix === 't') {
		 			//send to player-------------------------------------
					var activePlayer = this._getInActivePlayerView();
					activePlayer.deleteLastScore();
					//----------------------------------------------------
					var isLeftActive = this._switchActivePlayer();
					this._refreshPlayerViews();

					this.matchModule.deleteLastScore(isLeftActive);
		 		}
		 	}
		 },

		/*
		 *
		 *  +++ NEW SCORE +++ NEW SCORE +++ NEW SCORE +++ NEW SCORE +++
		 *
		 *
		 */
		_onNewScore: function (value, check) {
			if(check) {
				this.matchModule.check(value, check);
				this._startNewLeg(this.matchModule.match.state.isPlayerLeftActive, this.matchModule.wonLegsAndSets());
			} else {
				var uid = _.uniqueId('t_');
				//send to player-------------------------------------
				var activePlayer = this._getActivePlayerView();
				activePlayer.newScore(value, uid);
				//----------------------------------------------------
				var isLeftActive = this._switchActivePlayer();
				this._refreshPlayerViews();				
				this.matchModule.newScore(value, isLeftActive, uid);
			}
		},

		_startNewLeg: function(isPlayerLeftActive, result) {
			var playerLeft = {
				isLeft: true,
				isPlayerActive: isPlayerLeftActive
			};

			var playerRight = {
				isLeft: false,
				isPlayerActive: !isPlayerLeftActive
			};

			if(result) {
				_.extend(playerLeft, result);
				_.extend(playerRight, result);
			}

			this.ScorePlayerLeft.show(new PlayerLayout({
				model: new Backbone.Model (playerLeft)
			}));
			this.ScorePlayerRight.show(new PlayerLayout({
				model: new Backbone.Model (playerRight)
			}));			
		},

		_startNewMatch: function () {
			if(this.matchModule.started) {
				this.matchModule.stop();
			}
			this.matchModule.start();
			this._startNewLeg(true);
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
