define([
	'backbone',
	'communicator',
	'hbs!tmpl/layout/checkOut_tmpl'
],
function( Backbone, Communicator, CheckoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		level: 0,
		error: 0,

		levelTime: [40, 30, 25, 20, 15, 10, 7, 5, 3],
		totalElapsedTime: 0,
		points: 0,

		orgCheckers: null,
		checkers: [	170, 167, 164, 161, 160, 158, 157, 156, 155, 154, 153, 152, 151, 150,
				   	149, 148, 147, 146, 145, 144, 143, 142, 141, 140,
				 	139, 138, 137, 136, 135, 134, 133, 132, 131, 130,
					129, 128, 127, 126, 125, 124, 123, 122, 121, 120,
					119, 118, 117, 116, 115, 114, 113, 112, 111, 110,
					109, 108, 107, 106, 105, 104, 103, 102, 101, 100,
					99, 98, 97, 96, 95, 94, 93, 92, 91, 90,
					89, 88, 87, 86, 85, 84, 83, 82, 81, 80,
					79, 78, 77, 76, 75, 74, 73, 72, 71, 70,
					69, 68, 67, 66, 65, 64, 63, 62, 61, 60
		],

		bestWay: {
			'170': {
				best: ['T20 - T20 - D25']
			},
			'167': {
				best: ['T20 - T19 - D25']
			},
			'164': {
				best: ['T20 - T18 - D25']
			},
			'161': {
				best: ['T20 - T17 - D25']
			},
			'160': {
				best: ['T20 - T20 - D20']
			},
			'158': {
				best: ['T20 - T20 - D19']
			},
			'157': {
				best: ['T20 - T19 - D20']
			},
			'156': {
				best: ['T20 - T20 - D18']
			},
			'155': {
				best: ['T20 - T19 - D19']
			},
			'154': {
				best: ['T20 - T18 - D20']
			},
			'153': {
				best: ['T20 - T19 - D18']
			},
			'152': {
				best: ['T20 - T20 - D16']
			},
			'151': {
				best: ['T20 - T17 - D20', 'T19 - T18 - D20']
			},
			'150': {
				best: ['T20 - T20 - D15', 'T20 - T18 - D18', 'T19 - T19 - D18']
			},
			'149': {
				best: ['T20 - T19 - D16']
			},
			'148': {
				best: ['T20 - T20 - D14', 'T19 - T17 - D20']
			},
			'147': {
				best: ['T20 - T17 - D18', 'T19 - T18 - D18']
			},
			'146': {
				best: ['T20 - T20 - D13', 'T20 - T18 - D16']
			},
			'145': {
				best: ['T20 - T19 - D14', 'T20 - T15 - D20']
			},
			'144': {
				best: ['T20 - T20 - D12', 'T19 - T19 - D20']
			},
			'143': {
				best: ['T20 - T17 - D16']
			},
			'142': {
				best: ['T20 - T20 - D11', 'T20 - T14 - D20']
			},
			'141': {
				best: ['T20 - T19 - D12', 'T17 - T18 - D18']
			},
			'140': {
				best: ['T20 - T20 - D10', 'T18 - T18 - D20']
			},
			'139': {
				best: ['T20 - T17 - D14', 'T20 - T13 - D20']
			},
			'138': {
				best: ['T20 - T18 - D12', 'T18 - T18 - D10']
			},
			'137': {
				best: ['T20 - T17 - D13', 'T20 - T15 - D16']
			},
			'136': {
				best: ['T20 - T20 - D8']
			},
			'135': {
				first: ['25'],
				i: 'Den 1. Dart auf Bull, bei Single bleibt <b>110</b> Rest',
				best: ['T20 - T17 - D12', 'D25 - T19 - D14']
			},
			'134': {
				best: ['T20 - T14 - D16', 'T18 - T18 - D18']
			},
			'133': {
				best: ['T20 - T19 - D8', 'T18 - T13 - D20']
			},
			'132': {
				first: ['25'],
				i: 'Den 1. Dart auf Bull, bei Single bleibt <b>107</b> Rest',
				best: ['T20 - T16 - D12', 'T20 - T18 - D8', 'D25 - D25 - D16']
			},
			'131': {
				best: ['T20 - T13 - D16']
			},
			'130': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single bleibt <b>110</b> Rest',
				best: ['T20 - T20 - D10', 'T19 - T19 - D8']
			},
			'129': {
				first: ['25', '19'],
				i: 'Den 1. Dart auf Bull oder 19, bei Single bleibt ein 2 Dart Finish Rest (104, 110)<br>Trifft der 1. T20 ist mit Single Bull-Finish möglich',
				best: ['D25 - T13 - D20', 'T19 - T16 - D12' , 'T20 - T19 - D6']
			},
			'128': {
				first: ['18'],
				i: 'Den 1. Dart auf 18, bei Single bleibt <b>110</b> Rest<br>Trifft der 1. T20 ist mit Single Bull-Finish möglich',
				best: ['T18 - T18 - D10', 'T20 - T20 - D4']
			},
			'127': {
				first: ['20', '17'],
				i: 'Den 1. Dart auf 20 oder 17, bei Single bleibt ein 2 Dart Finish Rest (110, 107)',
				best: ['T20 - T17 - D8']
			},
			'126': {
				first: ['25', '19', '16'],
				i: 'Den 1. Dart auf 25, 19 oder 16, bei Single bleibt ein 2 Dart Finish Rest (110, 107, 101)',
				best: ['T19 - T15 - D12']

			},
			'125': {
				first: ['25', '18'],
				i: 'Den 1. Dart auf Bull oder, bei Single bleibt ein 2 Dart Finish Rest (100, 107)',
				best: ['D25 - T19 - D14', 'T18 - T13 - D16']
			},
			'124': {
				first: ['20', '17'],
				i: 'Den 1. Dart auf 20 oder 17, bei Single bleibt  ein 2 Dart Finish Rest (104, 107)',
				best: ['T20 - T20 - D2']
			},
			'123': {
				first: ['25', '19'],
				i: 'Den 1. Dart auf Bull oder 19, bei Single bleibt  ein 2 Dart Finish Rest (98, 104)',
				best: ['T19 - T10 - D18']
			},
			'122': {
				first: ['25', '18'],
				i: 'Den 1. Dart auf Bull oder 18, bei Single bleibt  ein 2 Dart Finish Rest (97, 104)',
				best: ['T18 - T20 - D4']
			},
			'121': {
				first: ['25', '20', '17'],
				i: 'Den 1. Dart auf Bull, 20 oder 17, bei Single bleibt  ein 2 Dart Finish Rest (96, 101, 104)',
				best: ['T20 - 25 - D18', 'T17 - T10 - D20']
			},
			'120': {
				best: ['T20 - 20 - D20']
			},
			'119': {
				first: ['19'],
				best: ['T19 - T12 - D13', 'T19 - T10 - D16'],
				i: 'Den 1. Dart auf 19, bei Single bleibt <b>100</b> Rest<br>Achtung: Single 20 wär fatal...'
			},
			'118': {
				first: ['18'],
				best: ['T20 - 18 - D20'],
				i: 'Den 1. Dart auf 18, bei Single bleibt <b>100</b> Rest'
			},
			'117': {
				best: ['T20 - 18 - D20'],
			},
			'116': {
				best: ['T20 - 16 - D20', 'T20 - 20 - D18'],
			},
			'115': {
				best: ['T20 - 15 - D20'],
			},
			'114': {
				best: ['T20 - 14 - D20'],
			},
			'113': {
				best: ['T20 - 13 - D20'],
			},
			'112': {
				best: ['T20 - 20 - D16', 'T20 - 12 - D20', 'T19 - 15 - D20'],
			},
			'111': {
				best: ['T20 - 11 - D20', 'T20 - 19 - D16'],
			},
			'110': {
				best: ['T20 - D25'],
			},
			'109': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 5 bleibt ein 2 Dart Finish <b>104</b> Rest',
				best: ['T20 - 17 - D16', 'T20 - 9 - D20'],
			},
			'108': {
				first: ['19', '18'],
				i: 'Den 1. Dart auf 19 oder 18, bei Single 7, 5 bleibt ein 2 Dart Finish <b>(101, 104)</b> Rest',
				best: ['T19 - 19 - D16', 'T18 - 18 - D18'],
			},
			'107': {
				first: ['19'],
				i: 'Den 1. Dart auf 19, bei Single 7, 3 bleibt ein 2 Dart Finish <b>(100, 104)</b> Rest',
				best: ['T19 - D25']
			},
			'106': {
				first: ['20', '16'],
				i: 'Den 1. Dart auf 20 oder 16, bei Single 5, 8 bleibt ein 2 Dart Finish <b>(101, 98)</b> Rest',
				best: ['T20 - 14 - D16', 'T16 - 18 - D20']
			},
			'105': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 5, 1 bleibt ein 2 Dart Finish <b>(101, 104)</b> Rest',
				best: ['T20 - 5 - D20']
			},
			'104': {
				first: ['19'],
				i: 'Den 1. Dart auf 19, bei Single 7, 3 bleibt ein 2 Dart Finish <b>(97, 101)</b> Rest',
				best: ['T19 - 15 - D16']
			},
			'103': {
				first: ['19'],
				i: 'Den 1. Dart auf 19, bei Single 7, 3 bleibt ein 2 Dart Finish <b>(96, 100)</b> Rest',
				best: ['T19 - 14 - D16']
			},
			'102': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 5, 1 bleibt ein 2 Dart Finish <b>(97, 101)</b> Rest',
				best: ['T20 - 10 - D16']
			},
			'101': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 5, 1 bleibt ein 2 Dart Finish <b>(96, 100)</b> Rest<br>Bei T17 ist Single 2 fatal...',
				best: ['T17 - D25', 'T20 - 1 - D20']
			},
			'100': {
				best: ['T20 - D20']
			},
			'99': {
				best: ['T19 - 12 - D20', 'D25 - 17 - D16']
			},
			'98': {
				best: ['T20 - D19']
			},
			'97': {
				best: ['T19 - D20']
			},
			'96': {
				best: ['T20 - D18']
			},
			'95': {
				best: ['T19 - D19']
			},
			'94': {
				best: ['T18 - D20']
			},
			'93': {
				best: ['T19 - D18']
			},
			'92': {
				best: ['T20 - D16']
			},
			'91': {
				best: ['T17 - D20']
			},
			'90': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 20, Single 20 = Bull Finish',
				best: ['T18 - D18', 'T20 - D15']
			},
			'89': {
				best: ['T19 - D16']
			},
			'88': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 20, Single 18 = Bull Finish',
				best: ['T20 - D14', 'T16 - D20']
			},
			'87': {
				best: ['T17 - D18']
			},
			'86': {
				best: ['T18 - D16']
			},
			'85': {
				best: ['T19 - D14', 'T15 - D20']
			},
			'84': {
				best: ['T20 - D12']
			},
			'83': {
				best: ['T17 - D16']
			},
			'82': {
				first: ['25'],
				i: 'Den 1. Dart auf Bull, bei Single 25, Single 17 = D20',
				best: ['T14 - D20', 'D25 - D16']
			},
			'81': {
				best: ['T19 - D12']
			},
			'80': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single 20, Single 20 = D20',
				best: ['T16 - D16', 'T20 - D15']
			},
			'79': {
				first: ['19'],
				i: 'Den 1. Dart auf 19, bei Single 20, Single 20 = D20',
				best: ['T13 - D20', 'T19 - D22']
			},
			'78': {
				first: ['18'],
				i: 'Den 1. Dart auf 18, bei Single 20, Single 20 = D20',
				best: ['T18 - D12']
			},
			'77': {
				best: ['T15 - D16', 'T19 - D10']
			},
			'76': {
				best: ['T20 - D8']
			},
			'75': {
				best: ['T17 - D12', 'T13 - D18']
			},
			'74': {
				best: ['T14 - D16']
			},
			'73': {
				best: ['T19 - D8']
			},
			'72': {
				best: ['T16 - D12', 'T12 - D18']
			},
			'71': {
				best: ['T13 - D16']
			},
			'70': {
				best: ['T18 - D8', 'T10 - D20']
			},
			'69': {
				best: ['T15 - D12']
			},
			'68': {
				best: ['T20 - D4']
			},
			'67': {
				best: ['T17 - D8']
			},
			'66': {
				best: ['T10 - D18']
			},
			'65': {
				best: ['25 - D20', 'T19 - D4']
			},
			'64': {
				best: ['T20 - D2']
			},
			'63': {
				best: ['T13 - D12']
			},
			'62': {
				best: ['T20 - D1', 'T10 - D16']
			},
			'61': {
				best: ['25 - D18', 'T15 - D8', 'T19 - D2']
			},
			'60': {
				best: ['20 - D20']
			},
		},

		interval: null,

		initialize: function() {
			_.bindAll(this, '_onCheckBattleHighscore', '_getCheckBattleHighscore');
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CHECK_BATTLE-UPDATED', this._getCheckBattleHighscore);
			this.listenTo(Communicator.mediator, 'APP:SOCKET:CONNECTED', this._getCheckBattleHighscore);
		},

    	template: CheckoutTmpl,


    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {
			checkOutButtton: '.check-out-btn',
			startButton: '.btn-success',
			checkButton: '.btn-warning',
			resultButton: '.check-out-result',
			checkOutValueText: '.check-out-value',
			checkInfoAndPoints: '.check-info-and-points',
			divCheckCount: '.check-count',
			divCheckPoints: '.check-points',
			divCheckLevel: '.check-level',
			divCheckTime: '.check-time',
			divHighPlayerName: '.check-out-highscore-player-name',
			divHighPlayerScore: '.check-out-highscore-player',
			divHighUserScore: '.check-out-my-record'
		},

		/* Ui events hash */
		events: {
			'click @ui.checkOutButtton': '_onClickCheckOutButtton',
			'click @ui.startButton': '_onClickStartButtton',
			'click @ui.checkButton': '_onClickCheckButtton'
		},

		_onClickStartButtton: function () {
			if(this.error === 3 || this.level === 8) {
				this.checkers = _.clone(this.orgCheckers);
				this.error = 0;
				this.level = 0;
				this.totalElapsedTime = 0;
				this.points = 0;
				this.ui.divCheckLevel.text(1);
				this.ui.divCheckCount.text(0);
				this.ui.divCheckPoints.text(0);
				this.ui.divCheckTime.text(0);
			}


			this.ui.startButton.text(this.levelTime[this.level]);
			this.unlockActionButtons(false);
			var checkThisOut = Math.floor((Math.random() * this.checkers.length) + 1);
			this.ui.checkOutValueText.text(this.checkers[checkThisOut]);

			this.checkers = _.without(this.checkers, this.checkers[checkThisOut]);

			var _self = this;
			this.interval = setInterval(function () {
				var txt = $(_self.ui.startButton[0]).text();
				var nbr = Number(txt) - 1;
				if(nbr === -1) {
					_self._check();
				} else {
					_self.ui.startButton.text(nbr);
				}
			}, 1000);
		},

		_check: function () {
			this._verifyCheck();

			var cCount = Number(this.ui.divCheckCount.text());
			this.ui.divCheckCount.text(cCount + 1);
			if(((cCount+1) % 5) === 0) {
				var cLevel = Number(this.ui.divCheckLevel.text());
				this.ui.divCheckLevel.text(cLevel + 1);
				this.level = cLevel;
			}

			this.ui.startButton.text('START');
			window.clearInterval(this.interval);
			this.unlockActionButtons(true);

			this.ui.checkInfoAndPoints.show();

			if(this.level === 8 || this.error === 3) {
				if(App.module('LoginModule').isLoggedIn()) {
					App.module('SocketModule').SetCheckBattleScore({
						userUid: App.module('LoginModule').loggedInUserId(),
						userName: App.module('LoginModule').loggedInUserName(),
						score: this.points
					});
				}
			}
		},

		_verifyCheck: function () {
			var txt = this.ui.checkOutValueText.text();
			var nbr = Number(txt);

			var isLastD = false;
			var isBeforeD = false;

			var score = 0;
			var thrownDarts = 0;

			var theField = [];
			var theWay = '';
			var afterFirstRest = -1;

			_.each(this.ui.resultButton, function (btn) {
				var txt = $(btn).text();
				theWay += (theWay?' - ':'') + txt;
				if(txt.indexOf('-') === -1) {
					thrownDarts += 1;
					if(txt[0] === 'T') {
						var subTxt = txt.substr(1, txt.length);
						var num = Number(subTxt);
						theField.push(num);
						score = score + (num * 3);
						isLastD = false;
						if(!afterFirstRest) {
							afterFirstRest = nbr -score;
						}
					} else if(txt[0] === 'D') {
						var subTxt = txt.substr(1, txt.length);
						var num = Number(subTxt);
						theField.push(num);
						score = score + (num * 2);
						if(isLastD) {
							isBeforeD = true;
						}
						isLastD = true;
						if(!afterFirstRest) {
							afterFirstRest = nbr - score;
						}
					} else {
						var num = Number(txt);
						theField.push(num);
						score = score + num;
						isLastD = false;
						if(!afterFirstRest) {
							afterFirstRest = nbr - score;
						}
					}
				}
			})

			var points = 0;
			var text = null;
			if(nbr === score && isLastD) {
				points = points + 2;
				text = '<div><i class="fa fa-check-circle text-success"></i></div>';
				text += '<div>' + txt + ' wurde gecheckt </div>';
				if(isBeforeD) {
					if(score > 70) {
						points = points + 2;
						text += '<div>Niiice!!! Doppel Doppel...</div>';
					} else {
						points = points - 1;
						text += '<div>Bullshit!!! Doppel Doppel, Punktabzug...</div>';
					}
				}
				if((score < 99 || score === 100) && thrownDarts > 2) {
					points = points - 1;
					text += '<div>Kann mit 2 Darts gecheckt werden, Punktabzug...</div>';
				}
				if(this.bestWay[score]) {
					var addP = ''
					var addB = ''
					if(this.bestWay[score].first) {
						if(this.bestWay[score].first.join().indexOf(theField[0]) > -1) {
							points += 2;
							addP = " = 2 Zusatzpunkte"
						}
					}
					if(this.bestWay[score].best) {
						if(this.bestWay[score].best.join().indexOf(theWay) > -1) {
							points += 2;
							addB = " = 2 Zusatzpunkte"
						}
					}
					if(this.bestWay[score].i) {
						text += '<div>' + this.bestWay[score].i + addP + '</div>';
					}
					if(this.bestWay[score].best) {
						text += '<div>Best: ' + this.bestWay[score].best.join() + addB + '</div>';
					}
				}
				if(score >= 111) {
					if(theField[2] === 20 || theField[2] === 18 || theField[2] === 16 || theField[2] === 12 || theField[2] === 8 || theField[2] === 4 ) {
						points = points + 1;
						text += '<div>Standard-Doppel = 1 Zusatzpunkt</div>';
					}
				} else {
					if(theField[1] === 20 || theField[1] === 18 || theField[1] === 16 || theField[1] === 12 || theField[1] === 8 || theField[1] === 4  ) {
						points = points + 1;
						text += '<div>Standard-Doppel = 1 Zusatzpunkt</div>';
					}
				}
				if(afterFirstRest <= 70 && afterFirstRest >= 61) {
					var fifty = afterFirstRest - Number(theField[1])
					if(fifty === 50) {
						points = points + 2;
						text += '<div>Clever, Bull-Finish Option gezogen = 2 Zusatzpunkte</div>';
					}
				}
			} else {
				text = '<div><i class="fa fa-ban text-danger"></i></div>';
				text += '<div>Fehler, ' + txt + ' wurde nicht gecheckt</div>';
				if(this.bestWay[score]) {
					text += '<div><b>' + this.bestWay[score].i + '</b></div>';
				}
				this.error += 1;
				if(this.error === 3 && this.level !== 8) {
					text = '<div>3. Fehler - Spiel endet</div>' + '<div><button class="btn btn-success">Restart</button></div>' + text;
				}
			}

			if(this.level === 8) {
				text = '<div>Höchstes Level erreicht - Spiel endet</div>' + '<div><button class="btn btn-success">Restart</button></div>' + text;
			}

			text += '<div>Punkte: ' + points + ' </div>';

			var tT = this.levelTime[this.level] - Number($(this.ui.startButton[0]).text());
			this.totalElapsedTime += tT;

			var cCount = Number(this.ui.divCheckCount.text());
			var magicCalc = (points * 1000) - (this.error * 500) + (cCount > 0?(Math.round(cCount/this.totalElapsedTime*1000)):0);
			this.points += magicCalc;

			this.ui.divCheckPoints.text(this.points);

			var secs = (((this.totalElapsedTime % 60) < 10)?'0':'') + (this.totalElapsedTime % 60);

			this.ui.divCheckTime.text(Math.floor(this.totalElapsedTime/60) + '.' + secs + 'm');
			this.ui.checkInfoAndPoints.html(text);
		},

		onDestroy: function () {
			window.clearInterval(this.interval)
		},

		_onClickCheckButtton: function () {
			this._check();
		},

		_onClickCheckOutButtton: function (e) {
			var $ele = $(e.target);
			var value  = $ele.text();
			var isNum = $.isNumeric(value);

			var rBtn = this.ui.resultButton;
			var $toSetBtn = null;

			if($(rBtn[0]).text().indexOf('-') > -1) {
				$toSetBtn = rBtn[0];
			} else if ($(rBtn[1]).text().indexOf('-') > -1) {
				$toSetBtn = rBtn[1];
			} else if($(rBtn[2]).text().indexOf('-') > -1) {
				$toSetBtn = rBtn[2];
			}

			if($toSetBtn) {
				if (isNum) {
					$($toSetBtn).text($($toSetBtn).text().replace('-', value));
				} else {
					$($toSetBtn).text(value + '-');
				}
			}

		},

		unlockActionButtons: function (unlock) {
			this.ui.checkInfoAndPoints.hide();
			this.ui.startButton.attr('disabled', !unlock);
			this.ui.checkOutButtton.attr('disabled', unlock);
			if(unlock) {
				this.ui.checkButton.hide();
			} else {
				this.ui.resultButton.text('-');
				this.ui.checkButton.show();
			}
			this.ui.checkButton.attr('disabled', unlock);
		},

		/* on render callback */
		onRender: function() {
			this.orgCheckers = _.clone(this.checkers);

			this.unlockActionButtons(true);
			this._getCheckBattleHighscore();
		},

		_getCheckBattleHighscore: function() {
			var data = {
				userId: App.module('LoginModule').loggedInUserId()
			}
			App.module('SocketModule').GetCheckBattleHighscore(data, this._onCheckBattleHighscore)
		},

		_onCheckBattleHighscore: function(data) {
			this.ui.divHighPlayerName.text(data.high[0].userName);
			this.ui.divHighPlayerScore.text(data.high[0].score);
			if(data.user && data.user.length > 0) {
				this.ui.divHighUserScore.text(data.user[0].score);
			}
		}

	});

});

