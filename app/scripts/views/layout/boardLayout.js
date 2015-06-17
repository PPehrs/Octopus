define([
	'backbone',
	'backbone.marionette',
	'communicator',
	'bootbox',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'./boardPanelLayout',
	'./encounterPanelLayout',
	'./playerLayout',
	'../item/scoreItem',
	'modules/matchModule'
],
function( Backbone, Marionette, Communicator, Bootbox, BoardlayoutTmpl, BoardPanel, EncounterPanel, PlayerLayout, ScoreItem, MatchModule  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		matchModule: App.module('MatchModule'),

    	template: BoardlayoutTmpl,

    	/* Layout sub regions */
    	regions: {
    		ScoreRegion: '#octopus_score',
    		ScorePlayerLeft: '#octopus_playerLeft',
    		ScorePlayerRight: '#octopus_playerRight',
    		BoardPanelRegion: '#octopus_boardPanel',
			EncounterPanelRegion: '#octopus_encounterPanel'
    	},

    	/* ui selector cache */
    	ui: {
			CheckBoxTransmit: '#chkTransmit',

			ButtonNewMatch:  '#btnNewMatch'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonNewMatch': '_onClickNewMatch',
			'click @ui.ButtonEndMatch': '_onClickNewMatch'
		},

		childEvents: {
			'playerMenu:player:active': function (child, isLeft) {
				this._onActivatePlayer(isLeft);
			},
			'scoreItem:new:score': function (child, value, miss, check) {
				this._onNewScore(value, miss, check);
			},
			'scoreItem:undo:score': function (child) {
				this._onUndoScore();
			},
			'playerName:change:activePlayer': function (child, isLeft) {
				this._onActivePlayerChange(isLeft);
			},
			'playerName:change:name': function (child, name, isLeft) {
				this._onPlayerNameChange(name, isLeft);
			},
			'playerScore:change:value': function (child, value, uid) {
				this._onChangeScore(value, uid);
			},
			'playerMenu:switch:names': function () {
				this._onSwitchPlayerNames();
			},
		},

		_onActivatePlayer: function (isLeft) {
			if(this.matchModule.match.state.isPlayerLeftActive === isLeft) {
				return;
			}

			var playerViewLeft = this.ScorePlayerLeft.currentView.PlayerScoresRegion.currentView;
			var playerViewRight = this.ScorePlayerRight.currentView.PlayerScoresRegion.currentView;
			if(isLeft) {
				if(playerViewLeft.collection.length > playerViewRight.collection.length) {
					return;
				}
			} else {
				if(playerViewRight.collection.length > playerViewLeft.collection.length) {
					return;
				}
			}

			this.matchModule.match.state.isPlayerLeftActive = isLeft;
			this.ScorePlayerLeft.currentView.model.set('isPlayerActive', isLeft);
			this.ScorePlayerRight.currentView.model.set('isPlayerActive', !isLeft);

			this._refreshPlayerViews();
		},

		_onSwitchPlayerNames: function () {
			var player = this.getPlayer();
			player[0].isLeft = !player[0].isLeft;
			player[1].isLeft = !player[1].isLeft;
			this.matchModule.savePlayer(player[0]);
			this.matchModule.savePlayer(player[1]);
			var playerLeft = this.ScorePlayerLeft.currentView.PlayerNameRegion.currentView;
			var playerRight = this.ScorePlayerRight.currentView.PlayerNameRegion.currentView;

			var n1 = _.findWhere(player, {isLeft: true}).name;
			var n2 = _.findWhere(player, {isLeft: false}).name;

			playerLeft.setPlayerName(n1);
			playerRight.setPlayerName(n2);
		},

		_onPlayerNameChange: function(name, isLeft) {
			var player = {
				name: name,
				isLeft: isLeft
			}
			this.matchModule.savePlayer(player);
		},

		_onActivePlayerChange: function(isLeft) {
			var playerView = this.ScorePlayerLeft.currentView.PlayerScoresRegion.currentView;
			if(!isLeft) {
				playerView = this.ScorePlayerRight.currentView.PlayerScoresRegion.currentView;
			}

			var score = playerView.collection.at(0);
			var rest = score.get('score');

			this.ScoreRegion.currentView.canCheck(this.matchModule.possibleCheckWith(rest));
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
		 *  +++ UNDO SCORE +++ UNDO SCORE +++ UNDO SCORE +++ UNDO SCORE +++
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
		 *  +++ CHANGE SCORE +++ CHANGE SCORE +++ CHANGE SCORE +++ CHANGE SCORE +++
		 *
		 *
		 */
		 _onChangeScore: function(value, uid) {
			var change = this.matchModule.changeScore(value, uid);

			if(change.isLeft) {
				this.ScorePlayerLeft.currentView.reloadPlayerScores(change.entries);
			} else {
				this.ScorePlayerRight.currentView.reloadPlayerScores(change.entries);
			}
		 },

		/*
		 *
		 *  +++ NEW SCORE +++ NEW SCORE +++ NEW SCORE +++ NEW SCORE +++
		 *
		 *
		 */
		_onNewScore: function (value, miss, check) {
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
				this.matchModule.newScore(value, miss, isLeftActive, uid);
			}
		},

		_loadStoredMatch: function(isPlayerLeftActive, result, activeLeg) {
			if(result) {
				delete result.isLeftCheck;
			}

			var playerLeft = {
				load: true,
				isLeft: true,
				isPlayerActive: isPlayerLeftActive			};

			var playerRight = {
				load: true,
				isLeft: false,
				isPlayerActive: !isPlayerLeftActive
			};

			if(result) {
				_.extend(playerLeft, result);
				_.extend(playerRight, result);
			}

			if(activeLeg && !_.isEmpty(activeLeg.entries)) {
				var scoresLeft = _.where(activeLeg.entries, {isLeft:true});
				var scoresRight = _.where(activeLeg.entries, {isLeft:false});
				_.extend(playerLeft, {scores: scoresLeft});
				_.extend(playerRight, {scores: scoresRight});
			}

			this.ScorePlayerLeft.show(new PlayerLayout({
				model: new Backbone.Model (playerLeft)
			}));
			this.ScorePlayerRight.show(new PlayerLayout({
				model: new Backbone.Model (playerRight)
			}));

			var self = this;
			setTimeout(function() {
				self._onActivePlayerChange(isPlayerLeftActive);
			})
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

			var self = this;
			setTimeout(function() {
				self._onActivePlayerChange(isPlayerLeftActive);
			})
		},

		_startNewMatch: function () {
			if(this.matchModule.started) {
				this.matchModule.stop();
			}
			this.matchModule.start();
			this._startNewLeg(true);
		},

		initialize: function() {
			this.listenTo(Communicator.mediator, 'load:match', this._loadStoredMatch);
		},

		getPlayer: function () {
			var player = [];

			var playerLeft = this.ScorePlayerLeft.currentView.PlayerNameRegion.currentView.getPlayer();
			var playerRight = this.ScorePlayerRight.currentView.PlayerNameRegion.currentView.getPlayer();

			player.push(playerLeft);
			player.push(playerRight);

			return player;
		},
		/* on render callback */
		onRender: function() {
			this.ui.CheckBoxTransmit.bootstrapSwitch();

			//---------------------------------------------
			this._startNewMatch();
			//---------------------------------------------

			this.ScoreRegion.show(new ScoreItem({}));
			this.BoardPanelRegion.show(new BoardPanel({}));
			this.EncounterPanelRegion.show(new EncounterPanel({}));
		}
	});

});
