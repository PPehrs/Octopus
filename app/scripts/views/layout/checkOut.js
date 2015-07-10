define([
	'backbone',
	'hbs!tmpl/layout/checkOut_tmpl'
],
function( Backbone, CheckoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		level: 0,
		error: 0,

		levelTime: [40, 30, 25,  20, 15, 10, 5],
		totalElapsedTime: 0,

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
			'135': {
				first: ['25'],
				i: 'Den 1. Dart auf Bull, bei Single bleibt <b>110</b> Rest'
			},
			'132': {
				first: ['25'],
				i: 'Den 1. Dart auf Bull, bei Single bleibt <b>107</b> Rest'
			},
			'130': {
				first: ['20'],
				i: 'Den 1. Dart auf 20, bei Single bleibt <b>110</b> Rest'
			},
			'129': {
				first: ['25', '19'],
				i: 'Den 1. Dart auf Bull oder 19, bei Single bleibt ein 2 Dart Finish Rest (104, 110)'
			},
			'128': {
				first: ['18'],
				i: 'Den 1. Dart auf 18, bei Single bleibt <b>110</b> Rest'
			},
			'127': {
				first: ['20', '17'],
				i: 'Den 1. Dart auf 20 oder 17, bei Single bleibt ein 2 Dart Finish Rest (110, 107)'
			},
			'126': {
				first: ['25', '19', '16'],
				i: 'Den 1. Dart auf 25, 19 oder 16, bei Single bleibt ein 2 Dart Finish Rest (110, 107, 101)'
			},
			'125': {
				first: ['25'],
				i: 'Den 1. Dart auf Bull, bei Single bleibt <b>100</b> Rest'
			},
			'124': {
				first: ['20', '17'],
				i: 'Den 1. Dart auf 20 oder 17, bei Single bleibt  ein 2 Dart Finish Rest (104, 107)'
			},
			'123': {
				first: ['25', '19'],
				i: 'Den 1. Dart auf Bull oder 19, bei Single bleibt  ein 2 Dart Finish Rest (98, 104)'
			},
			'122': {
				first: ['25', '18'],
				i: 'Den 1. Dart auf Bull oder 18, bei Single bleibt  ein 2 Dart Finish Rest (97, 104)'
			},
			'121': {
				first: ['25', '20', '17'],
				i: 'Den 1. Dart auf Bull, 20 oder 17, bei Single bleibt  ein 2 Dart Finish Rest (96, 101, 104)'
			}

		},

		interval: null,

		initialize: function() {
			console.log("initialize a Checkout Layout");
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
		},

		/* Ui events hash */
		events: {
			'click @ui.checkOutButtton': '_onClickCheckOutButtton',
			'click @ui.startButton': '_onClickStartButtton',
			'click @ui.checkButton': '_onClickCheckButtton'
		},

		_onClickStartButtton: function () {
			if(this.error === 3 ) {
				this.checkers = _.clone(this.orgCheckers);
				this.error = 0;
				this.level = 0;
				this.totalElapsedTime = 0;
				this.ui.divCheckLevel.text(1);
				this.ui.divCheckCount.text(0);
				this.ui.divCheckPoints.text(0);
				this.ui.divCheckTime.text(0);
			}


			this.ui.startButton.text(this.levelTime[this.level]);
			this.unlockActionButtons(false);
			var checkThisOut = Math.floor((Math.random() * this.checkers.length) + 1);
			this.ui.checkOutValueText.text(this.checkers[checkThisOut]);

			this.checkers = _.without(this.checkers, checkThisOut);

			var _self = this;
			this.interval = setInterval(function () {
				var txt = _self.ui.startButton.text();
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
		},

		_verifyCheck: function () {
			var txt = this.ui.checkOutValueText.text();
			var nbr = Number(txt);

			var isLastD = false;
			var isBeforeD = false;

			var score = 0;
			var thrownDarts = 0;

			var theField = [];

			_.each(this.ui.resultButton, function (btn) {
				var txt = $(btn).text();
				if(txt.indexOf('-') === -1) {
					thrownDarts += 1;
					if(txt[0] === 'T') {
						var subTxt = txt.substr(1, txt.length);
						var num = Number(subTxt);
						theField.push(num);
						score = score + (num * 3);
						isLastD = false;
					} else if(txt[0] === 'D') {
						var subTxt = txt.substr(1, txt.length);
						var num = Number(subTxt);
						theField.push(num);
						score = score + (num * 2);
						if(isLastD) {
							isBeforeD = true;
						}
						isLastD = true;
					} else {
						var num = Number(txt);
						theField.push(num);
						score = score + num;
						isLastD = false;
					}
				}
			})

			var points = 0;
			var text = null;
			if(nbr === score && isLastD) {
				points = points + 2;
				text = '<div><i class="fa fa-info-circle text-success"></i></div>';
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
					if(this.bestWay[score].first) {
						debugger
						if(this.bestWay[score].first.join().indexOf(theField[0]) > -1) {
							points += 2;
							addP = " = 2 Zusatzpunkte"
						}
					}
					text += '<div>' + this.bestWay[score].i + addP + '</div>';
				}
			} else {
				text = '<div><i class="fa fa-ban text-danger"></i></div>';
				text += '<div>Fehler, ' + txt + ' wurde nicht gecheckt</div>';
				this.error += 1;
				if(this.error === 3) {
					text = '<div>3. Fehler - Spiel endet</div>' + '<div><button class="btn btn-success">Restart</button></div>' + text;
				}
			}

			text += '<div>Punkte: ' + points + ' </div>';

			this.ui.divCheckPoints.text(Number(this.ui.divCheckPoints.text()) + points);

			var tT = this.levelTime[this.level] - Number(this.ui.startButton.text());
			this.totalElapsedTime += tT;

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
		}
	});

});

