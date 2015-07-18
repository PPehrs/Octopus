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
    		Content: '#comp-analyse-here'
    	},



		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickStart'
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
