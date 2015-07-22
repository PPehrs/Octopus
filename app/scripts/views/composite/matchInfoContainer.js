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
			template: _.template('<div class="fz-15"><i class="fa fa-info-circle m-r"></i>Die Begegnung wurde angelegt. Es sind noch keine Informationen vorhanden. Die Seite aktualisiert sich sobald weitere Informationen eingegeben wurden.</div>')
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
