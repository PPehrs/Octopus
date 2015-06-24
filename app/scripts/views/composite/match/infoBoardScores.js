define([
	'backbone',
	'hbs!tmpl/composite/infoBoardScores_tmpl',
	'views/item/match/infoBoardScore'
],
function( Backbone, InfoboardscoresTmpl, BoardScore  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

		initialize: function() {
			var specialData = {
				ave: 0,
				s: 0,
				t: 0,
				t4: 0,
				h8: 0
			}
			var col = this.collection.toJSON();
			var newCol = [];
			newCol.push({rest: 501});
			var lastRest = 501;
			var totalScore = 0;
			_.each(col, function (c) {
				if (c.value >= 60 && c.value < 100) {
					specialData.s += 1;
				} else if (c.value >= 100 && c.value < 140) {
					specialData.t += 1;
				} else if (c.value >= 140 && c.value < 180) {
					specialData.t4 += 1;
				} else if (c.value === 180) {
					specialData.h8 += 1;
				}

				totalScore += Number(c.value);
				var rest = lastRest - c.value;
				newCol.push({rest: rest, value: c.value});
				lastRest = rest;
			});

			if(newCol.length > 1) {
				specialData.ave = (totalScore / (newCol.length-1)).toFixed(2);
			}


			this.model.set(specialData);

			this.collection = new Backbone.Collection(newCol.reverse());

		},


    	template: InfoboardscoresTmpl,


    	/* ui selector cache */
    	ui: {},

		childView: BoardScore,

    	/* where are we appending the items views */
    	childViewContainer: ".octopus_infoBoardScores",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
