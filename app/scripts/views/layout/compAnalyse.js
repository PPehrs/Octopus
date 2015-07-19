define([
	'backbone',
	'hbs!tmpl/layout/compAnalyse_tmpl'
],
function( Backbone, CompanalyseTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Companalyse Layout");
		},
		
    	template: CompanalyseTmpl,
    	

    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {
    		ButtonStart: '#start-comp-analysis',
    		ButtonCheck: '#start-comp-analysis-check',
    		Content: '#comp-analyse-here'
    	},



		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickStart',
			'click @ui.ButtonCheck': '_onClickCheck'
		},

		_calculatePossibleMiss: function(scoreIn) {
			var missIn = 3;
			if(scoreIn >= 99) {
				missIn = 1;
			}
			else if(scoreIn > 50) {
				missIn = 2;
			}
			else if(!(scoreIn <= 40 && scoreIn % 2 == 0)) {
				missIn = 2;
			}
			return missIn;
		},

		_onClickCheckR: function(nameIn, compC, countMax, btnC) {
			var cc = App.module('CompController');
			var $c = this.ui.Content;

			$c.append('<div class="m-t fz3 ' +  btnC + '">Analyse ' + nameIn + ' - 111 Check-Versuche</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var totalMiss = 0;
			var totalCheck = 0;
			for (var i = 0; i < 111; i++) {
				cc.possi = 0;
				var missU = 0;
				
				var da = Math.floor((Math.random() * 169) + 2);
				var scoreIn = Math.floor((Math.random() * 160) + 1);
				var missIn = this._calculatePossibleMiss(da);
				var yo = {};
				var countTT = 0;
				do {
					yo = cc.setCheck(compC, da, missIn, scoreIn);
					missU += yo.miss;
					countTT += 1;
					if(yo.check) {
						$a1.append('<span class="fz1 btn-success"> [ ' + da + ' ] </span>');
					} else {
						var daRest = '<span>' + yo.rest + '</span>';
						if((yo.rest <= 40 && yo.rest % 2) || yo.rest === 50) {
							daRest = '<span style="background-color:darkgreen;color:white">' + yo.rest + '</span>';
						}
						$a1.append('<span class="fz1"> [ ' + da + ' / ' + daRest + ' ] </span>');
					}

					scoreIn = Math.floor((Math.random() * yo.rest) + 1);
					missIn = this._calculatePossibleMiss(yo.rest);
					da = yo.rest;
					if(yo.check) {
						totalCheck += 1;
					}
					totalMiss += yo.miss;
				} while(!yo.check);

				var qout = ( (1/(missU + 1)) * 100).toFixed(2);
				if(countTT > countMax) {
					$c.append('<span style="background-color:red;color:white">' + missU + ' / ' + qout + '% ||</span>');
				} else {
					$c.append('<span style="background-color:black;color:white">' + missU + ' / ' + qout + '% ||</span>');					
				}
			}		
			var qoute = ( (totalCheck/(totalMiss + totalCheck)) * 100).toFixed(2);
			$c.append('<div class="fz3 ' +  btnC + '">' + nameIn + ' Check-Qoute: <span style="background-color:darkred">'+ qoute + '%<span><span class="m-l-s" style="background-color:orange">'+ totalCheck + ' / ' + totalMiss + '<span></div>');

		},

		_onClickCheck: function() {
			var cc = App.module('CompController');
			var $c = this.ui.Content;
			$c.empty();

			//PRO *************************************************************************
			this._onClickCheckR('Profi', 1, 2, 'btn-primary');
			this._onClickCheckR('Spielstärke 1', 2, 3, 'btn-success');
			this._onClickCheckR('Spielstärke 2', 3, 4, 'btn-primary');
			this._onClickCheckR('Spielstärke 3', 4, 5, 'btn-success');
			this._onClickCheckR('Anfänger', 5, 6, 'btn-primary');
		},		

		_onClickStart: function() {
			var cc = App.module('CompController');
			var $c = this.ui.Content;
			$c.empty();

			//PRO *************************************************************************
			$c.append('<div class="fz3 btn-primary">Analyse Profi - 111 Würfe</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var sum = 0;
			for (var i = 0; i < 111; i++) {
				var yo = cc.buildPro();
				sum += yo;
				if(yo >= 80) {
					$a1.append('<span class="fz1"> [ ' + yo + ' ] </span>');
				} else {
					$a1.append('<span class="fz1" style="background-color:black;color:white"> [ ' + yo + ' ] </span>');	
				}
			}			
			var ave = (sum / 111).toFixed(2);
			$c.append('<div class="fz3 btn-primary">Average Profi: <span style="background-color:darkred">'+ ave + '<span></div>');

			//P1 *************************************************************************			
			$c.append('<div class="m-t fz3 btn-success">Analyse Spielstärke 1  (TOP) - 111 Würfe</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var sum = 0;
			for (var i = 0; i < 111; i++) {
				var yo = cc.buildP1();
				sum += yo;
				if(yo >= 60) {
					$a1.append('<span class="fz1"> [ ' + yo + ' ] </span>');
				} else {
					$a1.append('<span class="fz1" style="background-color:black;color:white"> [ ' + yo + ' ] </span>');	
				}
			}			
			var ave = (sum / 111).toFixed(2);
			$c.append('<div class="fz3 btn-success">Average Spielstärke 1: <span style="background-color:darkred">'+ ave + '<span></div>');

			//P3 *************************************************************************			
			$c.append('<div class="m-t fz3 btn-primary">Analyse Spielstärke 2  (GUT) - 111 Würfe</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var sum = 0;
			for (var i = 0; i < 111; i++) {
				var yo = cc.buildP2();
				sum += yo;
				if(yo >= 50) {
					$a1.append('<span class="fz1"> [ ' + yo + ' ] </span>');
				} else {
					$a1.append('<span class="fz1" style="background-color:black;color:white"> [ ' + yo + ' ] </span>');	
				}
			}			
			var ave = (sum / 111).toFixed(2);
			$c.append('<div class="fz3 btn-primary">Average Spielstärke 2: <span style="background-color:darkred">'+ ave + '<span></div>');			

			//P3 *************************************************************************			
			$c.append('<div class="m-t fz3 btn-success">Analyse Spielstärke 3  (MITTEL) - 111 Würfe</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var sum = 0;
			for (var i = 0; i < 111; i++) {
				var yo = cc.buildP3();
				sum += yo;
				if(yo < 60) {
					$a1.append('<span class="fz1"> [ ' + yo + ' ] </span>');
				} else {
					$a1.append('<span class="fz1" style="background-color:black;color:white"> [ ' + yo + ' ] </span>');	
				}
			}			
			var ave = (sum / 111).toFixed(2);
			$c.append('<div class="fz3 btn-success">Average Spielstärke 3: <span style="background-color:darkred">'+ ave + '<span></div>');						

			//A1 *************************************************************************			
			$c.append('<div class="m-t fz3 btn-warning">Analyse Spielstärke Anfänger 1 - 111 Würfe</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var sum = 0;
			for (var i = 0; i < 111; i++) {
				var yo = cc.buildP4();
				sum += yo;
				if(yo < 60) {
					$a1.append('<span class="fz1"> [ ' + yo + ' ] </span>');
				} else {
					$a1.append('<span class="fz1" style="background-color:black;color:white"> [ ' + yo + ' ] </span>');	
				}
			}			
			var ave = (sum / 111).toFixed(2);
			$c.append('<div class="fz3 btn-warning">Average Spielstärke Anfänger 1: <span style="background-color:darkred">'+ ave + '<span></div>');									

			//A1 *************************************************************************			
			$c.append('<div class="m-t fz3 btn-warning">Analyse Spielstärke Anfänger 2 - 111 Würfe</div>');

			var $a1 = $c.append('<div id="analyse1"></div>');
			var sum = 0;
			for (var i = 0; i < 111; i++) {
				var yo = cc.buildP5();
				sum += yo;
				if(yo < 60) {
					$a1.append('<span class="fz1"> [ ' + yo + ' ] </span>');
				} else {
					$a1.append('<span class="fz1" style="background-color:black;color:white"> [ ' + yo + ' ] </span>');	
				}
			}			
			var ave = (sum / 111).toFixed(2);
			$c.append('<div class="fz3 btn-warning">Average Spielstärke Anfänger 2: <span style="background-color:darkred">'+ ave + '<span></div>');												
		},

		/* on render callback */
		onRender: function() {}
	});

});
