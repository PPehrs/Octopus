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
			var res = App.module('StatisticController').calculateActiveLeg(this.collection.toJSON());
			this.model.set(res.specialData);
			this.collection = new Backbone.Collection(res.newCollection.reverse());
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
