define([
	'hbs!tmpl/item/impressum_tmpl'
],
function( ImpressumTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

    	template: ImpressumTmpl

	});

});
