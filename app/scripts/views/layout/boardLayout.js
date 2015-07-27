define([
	'backbone',
	'backbone.marionette',
	'communicator',
	'bootbox',
	'tooltipster',
	'hbs!tmpl/layout/boardLayout_tmpl',
	'./boardPanelLayout',
	'./encounterPanelLayout',
	'./computerOpponent_layout',
	'./onlineChallange_layout',
	'./playerLayout',
	'../item/board/scoreItem',
	'modules/matchModule'
],
function( Backbone, Marionette, Communicator, Bootbox, Tooltipster, BoardlayoutTmpl, BoardPanel, EncounterPanel, ComputerOpponent, OnlineChallange, PlayerLayout, ScoreItem, MatchModule  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		matchModule: App.module('MatchModule'),

    	template: BoardlayoutTmpl,

    	/* Layout sub regions */
    	regions: {
    		ScoreRegion: '#octopus_score',
    		PlayerLeftRegion: '#octopus_playerLeft',
    		PlayerRightRegion: '#octopus_playerRight',
    		BoardPanelRegion: '#octopus_boardPanel',
    		EncounterPanelRegion: '#octopus_encounterPanel',
			ComputerPanelRegion: '#octopus_computerPanel',
    	},

    	/* ui selector cache */
    	ui: {
			CheckBoxTransmit: '#chkTransmit',
			ButtonNewMatch:  '#btnNewMatch',
			ButtonOnlineMatch: '#btnOnlineMatch',
			ComputerOpponentMatch:  '#btnComputerMatch',
			MatchRunningAlert: '#octopus_matchInfo',
			MatchInfo: '#octopus_matchInfo .fa-info-circle',
			MatchStatistic: '#octopus_matchInfo .fa-line-chart',
			MatchResultQuickInfo: '#octopus_matchInfo .match-result-quickInfo',
			ButtonUndoLegWon: '.undo-leg-won',
			ButtonsEncounter: '.encounter-buttons'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonOnlineMatch': '_onClickOnlineMatch',
			'click @ui.ButtonNewMatch': '_onClickNewMatch',
			'click @ui.ButtonUndoLegWon': '_onClickUndoLegWon',
			'click @ui.ComputerOpponentMatch': '_onClickComputerOpponent'
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
			'playerScore:change:value': function (child, value, uid) {
				this._onChangeScore(value, uid);
			},
		},

		_onClickOnlineMatch: function () {
			this.BoardPanelRegion.$el.hide();
			this.EncounterPanelRegion.$el.hide();

			this.ComputerPanelRegion.show(new OnlineChallange({
				parent: this
			}));
		},

		_onClickComputerOpponent: function () {
			this.BoardPanelRegion.$el.hide();
			this.EncounterPanelRegion.$el.hide();

			this.ComputerPanelRegion.show(new ComputerOpponent({
				parent: this
			}));
		},

		startCompGame: function (comp) {
			var self = this;
			if(this.matchModule.started && this.matchModule.match && this.matchModule.match.started) {
				Bootbox.confirm('Aktuelles Match verwerfen und neues starten?', function (result) {
					if (result) {
						self.matchModule.stop();
						self._startNewComputerMatch(comp);
						setTimeout(function () {
							self._startNewComputerMatch(comp);
						});

					}
				});
			} else {
				self._startNewComputerMatch(comp);
				setTimeout(function () {
					self._startNewComputerMatch(comp);
				});
			}
		},

		hideComputerOpponent: function () {
			this.ComputerPanelRegion.empty();
			this.BoardPanelRegion.$el.show();
			this.EncounterPanelRegion.$el.show();
		},

		_onClickUndoLegWon: function () {
			this._onUndoScore();
		},

		_onActivatePlayer: function (isLeft) {
			if(this.matchModule.match.state.isPlayerLeftActive === isLeft) {
				return;
			}

			var playerViewLeft = this._PlayerScoresLeftView();
			var playerViewRight = this._PlayerScoresRightView();
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
			this._PlayerNameLeftView().model.set('isPlayerActive', isLeft);
			this._PlayerNameRightView().model.set('isPlayerActive', !isLeft);
			this._refreshPlayerViews();
		},

		_onActivePlayerChange: function(isLeft) {
			var playerView = this._PlayerScoresLeftView();
			if(!isLeft) {
				playerView = this._PlayerScoresRightView();
			}

			var score = playerView.collection.at(0);
			var rest = score.get('score');


			var match = App.module('MatchModule').match;
			if(!_.isEmpty(match)) {
				var res = App.module('StatisticController').calculateTotal(match);
				this._PlayerLeftView().stats(res.lData);
				this._PlayerRightView().stats(res.rData);
			}

			App.module('MatchModule').activePlayerRest = rest;
			this.ScoreRegion.currentView.canCheck(this.matchModule.possibleCheckWith(rest));
		},

		_onClickNewMatch: function () {
			var self = this;
			if(this.matchModule.started && this.matchModule.match && this.matchModule.match.started) {
				Bootbox.confirm('Aktuelles Match verwerfen und neues starten?', function (result) {
					if (result) {
						App.module('PlayerController').unsetComp();
						self.matchModule.stop();
						self._startNewMatch();
						setTimeout(function () {
							self._startNewMatch();
						});

					}
				});
			} else {
				App.module('PlayerController').unsetComp();
				self._startNewMatch();
				setTimeout(function () {
					self._startNewMatch();
				});
			}
		},

		missNeedsValue: function() {
			var isPlayerLeftActive = this.matchModule.match.state.isPlayerLeftActive;
			var score = 0;
			if(isPlayerLeftActive) {
				score = this._PlayerScoresLeftView().collection.at(0).get('score');
			} else {
				score = this._PlayerScoresRightView().collection.at(0).get('score');
			}

			if(score === 50 || (score <= 40 && score % 2 === 0 ) ) {
				return false;
			} else {
				return true;
			}
		},

		_getInActivePlayerView: function() {
			var isPlayerLeftActive = this.matchModule.match.state.isPlayerLeftActive;
			if(!isPlayerLeftActive) {
				return this._PlayerLeftView();
			} else {
				return this._PlayerRightView();
			}
		},

		_getActivePlayerView: function() {
			var isPlayerLeftActive = this.matchModule.match.state.isPlayerLeftActive;
			if(isPlayerLeftActive) {
				return this._PlayerLeftView();
			} else {
				return this._PlayerRightView();
			}
		},

		_switchActivePlayer: function() {
			var isLeftActive = !this.matchModule.match.state.isPlayerLeftActive; //switch active player
			this._PlayerNameLeftView().model.set('isPlayerActive', isLeftActive);
			this._PlayerNameRightView().model.set('isPlayerActive', !isLeftActive);
			return isLeftActive;
		},

		_refreshPlayerViews: function() {
			this._PlayerLeftView().refresh();
			this._PlayerRightView().refresh();
		},

		/*
		 *
		 *  +++ UNDO SCORE +++ UNDO SCORE +++ UNDO SCORE +++ UNDO SCORE +++
		 *
		 *
		 */
		 _onUndoScore: function() {
		 	this.ui.MatchRunningAlert.fadeOut();
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

					var self = this;
					setTimeout(function() {
						self._onActivePlayerChange(isLeftActive);
					})
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

			var rest = 0;
			if(change.isLeft) {
				rest = this._PlayerLeftView().reloadPlayerScores(change.entries);
			} else {
				rest = this._PlayerRightView().reloadPlayerScores(change.entries);
			}

			 if(this.matchModule.match.state.isPlayerLeftActive === change.isLeft) {
				 this.ScoreRegion.currentView.canCheck(this.matchModule.possibleCheckWith(rest));
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
				var activePlayer = this._getActivePlayerView();
				var score = activePlayer.PlayerScoresRegion.currentView.collection.toJSON()[0].score;
				this.matchModule.check(score, miss, check, value);
				var result = this.matchModule.wonLegsAndSets();
				this.ui.MatchResultQuickInfo.text(result.left.legsWon + ':' + result.right.legsWon);
				this.ui.MatchRunningAlert.fadeIn();
				this._startNewLeg(this.matchModule.match.state.isPlayerLeftActive, result);
			} else {
				this.ui.MatchRunningAlert.fadeOut();
				var uid = _.uniqueId('t_');
				//send to player-------------------------------------
				var activePlayer = this._getActivePlayerView();
				activePlayer.newScore(value, uid);
				//----------------------------------------------------
				var isLeftActive = this._switchActivePlayer();
				this._refreshPlayerViews();
				this.matchModule.newScore(value, miss, isLeftActive, uid);

				var self = this;
				setTimeout(function() {
					self._onActivePlayerChange(isLeftActive);
				})
			}
		},

		/*
		 *
		 *  +++ LOAD STORED +++ LOAD STORED +++ LOAD STORED +++ LOAD STORED +++
		 *
		 *
		 */
		_loadMatch: function (isPlayerLeftActive, result, activeLeg) {
			if(!activeLeg) {
				this._startNewLeg(true);
			} else {
				this._loadStoredMatch (isPlayerLeftActive, result, activeLeg)
			}
		},


		_loadStoredMatch: function(isPlayerLeftActive, result, activeLeg) {
			if(result) {
				delete result.isLeftCheck;
			}

			//p-name
			var playerLeftName = {
				isPlayerActive: isPlayerLeftActive
			};

			var playerRightName = {
				isPlayerActive: !isPlayerLeftActive
			};

			var storedPlayerLeft = App.module('PlayerController').getPlayerFromStorage(true);
			var storedPlayerRight = App.module('PlayerController').getPlayerFromStorage(false);

			if(storedPlayerLeft) {
				_.extend(playerLeftName, storedPlayerLeft);
			}

			if(storedPlayerRight) {
				_.extend(playerRightName, storedPlayerRight);
			}

			//p-scores
			var playerLeftScores = {
				load: true
			};
			var playerRightScores = {
				load: true
			};

			if(result) {
				result.left.endOf = false;
				result.right.endOf = false;
				result.left.countLegs = result.countLegs;
				result.right.countLegs = result.countLegs;
				_.extend(playerLeftScores, result.left);
				_.extend(playerRightScores, result.right);
			}

			if(activeLeg && !_.isEmpty(activeLeg.entries)) {
				var scoresLeft = _.where(activeLeg.entries, {isLeft:true});
				var scoresRight = _.where(activeLeg.entries, {isLeft:false});
				_.extend(playerLeftScores, {scores: scoresLeft});
				_.extend(playerRightScores, {scores: scoresRight});
			}

			this._showPlayers({
				isLeft: true,
				nameInfo: playerLeftName,
				resultInfo: playerLeftScores
			}, {
				isLeft: false,
				nameInfo: playerRightName,
				resultInfo: playerRightScores
			});

			var self = this;
			setTimeout(function() {
				self._onActivePlayerChange(isPlayerLeftActive);
			})
		},

		_showPlayers: function(playerLeft, playerRight) {
			var pL = new PlayerLayout({
				model: new Backbone.Model (playerLeft)
			});
			var pR = new PlayerLayout({
				model: new Backbone.Model (playerRight)
			});

			pL.otherPlayer = pR;
			pR.otherPlayer = pL;

			this.PlayerLeftRegion.show(pL);
			this.PlayerRightRegion.show(pR);
		},

		/*
		 *
		 *  +++ NEW LEG +++ NEW LEG +++ NEW LEG +++ NEW LEG +++
		 *
		 *
		 */
		_startNewLeg: function(isPlayerLeftActive, result) {
			//p-name
			var playerLeftName = {
				isPlayerActive: isPlayerLeftActive
			};

			var playerRightName = {
				isPlayerActive: !isPlayerLeftActive
			};

			var storedPlayerLeft = App.module('PlayerController').getPlayerFromStorage(true);
			var storedPlayerRight = App.module('PlayerController').getPlayerFromStorage(false);

			if(storedPlayerLeft) {
				_.extend(playerLeftName, storedPlayerLeft);
			}

			if(storedPlayerRight) {
				_.extend(playerRightName, storedPlayerRight);
			}

			//p-score
			var playerLeftScores = {};
			var playerRightScores = {};

			if(result) {
				result.left.endOf = true;
				result.right.endOf = true;
				result.left.countLegs = result.countLegs;
				result.right.countLegs = result.countLegs;
				_.extend(playerLeftScores, result.left);
				_.extend(playerRightScores, result.right);
			}

			this._showPlayers({
				isLeft: true,
				nameInfo: playerLeftName,
				resultInfo: playerLeftScores
			}, {
				isLeft: false,
				nameInfo: playerRightName,
				resultInfo: playerRightScores
			});

			var self = this;
			setTimeout(function() {
				self._onActivePlayerChange(isPlayerLeftActive);
			})
		},

		_startNewMatch: function (encounterUid) {
			this.ui.MatchRunningAlert.fadeOut();
			if(this.matchModule.started) {
				this.matchModule.stop();
			}

			this.matchModule.encounterUid = encounterUid;

			this.matchModule.start();
		},

		_startNewComputerMatch: function (comp) {
			this.ui.MatchRunningAlert.fadeOut();
			if(this.matchModule.started) {
				this.matchModule.stop();
			}

			this.matchModule.encounterUid = null;
			this.matchModule.start();
			App.module('PlayerController').onSetPlayerNameComputerAutomatic(this._PlayerLeftView(), comp);
		},


		_startNewOnlineMatch: function (data) {
			App.module('OnlineController').save(data);
			this.ui.MatchRunningAlert.fadeOut();
			if(this.matchModule.started) {
				this.matchModule.stop();
			}

			this.matchModule.encounterUid = null;
			this.matchModule.start();
			this.matchModule.match.onlineUid = data.uid;
			App.module('PlayerController').onSetPlayerNameOnlineAutomatic(this._PlayerLeftView(), data);
		},

		initialize: function() {
			this.listenTo(Communicator.mediator, 'load:match', this._loadMatch);
			this.listenTo(Communicator.mediator, 'encounterMatch:match:start', this._startNewMatch);

			this.listenTo(Communicator.mediator, 'ONLINE:MATCH:START:ONBOARD', this._startNewOnlineMatch);
		},

		/* on render callback */
		onRender: function() {
			this.ui.CheckBoxTransmit.bootstrapSwitch();

			//---------------------------------------------
			this.matchModule.cold = true;
			this._startNewMatch();
			//---------------------------------------------

			this.ScoreRegion.show(new ScoreItem({}));
			this.boardPanel = new BoardPanel({});
			this.BoardPanelRegion.show(this.boardPanel);
			this.encounterPanel = new EncounterPanel({});
			this.EncounterPanelRegion.show(this.encounterPanel);

			this.ui.MatchInfo.tooltipster({
            	content: $(
            		'<span>Das Match wird durch den Start eines neuen Matches beendet.</span>'
            	)
        	});

			this.ui.MatchStatistic.tooltipster({
            	content: $(
            		'<span>Klick hier f&uuml;r die Match-Statistik.</span>'
            	)
        	});
		},


		// --- HELPER ---

		_PlayerLeftView: function () {
			return this.PlayerLeftRegion.currentView;
		},

		_PlayerRightView: function () {
			return this.PlayerRightRegion.currentView;
		},

		_PlayerNameLeftView: function () {
			return this.PlayerLeftRegion.currentView.PlayerNameRegion.currentView;
		},

		_PlayerNameRightView: function () {
			return this.PlayerRightRegion.currentView.PlayerNameRegion.currentView;
		},

		_PlayerScoresLeftView: function () {
			return this.PlayerLeftRegion.currentView.PlayerScoresRegion.currentView;
		},

		_PlayerScoresRightView: function () {
			return this.PlayerRightRegion.currentView.PlayerScoresRegion.currentView;
		}
	});

});
