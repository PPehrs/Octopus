define([
	'backbone',
	'hbs!tmpl/composite/matchInfoContainer_tmpl',
	'../layout/matchInfo'
],
function( Backbone, MatchinfocontainerTmpl, MatchInfo  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

    	template: MatchinfocontainerTmpl,

		emptyView: Backbone.Marionette.ItemView.extend({
			template: _.template('<div><i class="fa fa-spin fa-spinner m-r"></i>Die Begegnung ist gestartet. Die Seite aktualisiert sich sobald neue Match-Daten vorhanden sind...</div>')
		}),

    	/* ui selector cache */
    	ui: {},

		childView: MatchInfo,

    	/* where are we appending the items views */
		childViewContainer: '.octopus_encounterMatchInfos',

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
