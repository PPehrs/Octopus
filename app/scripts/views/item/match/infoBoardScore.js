define([
	'backbone',
	'hbs!tmpl/item/infoBoardScore_tmpl'
],
function( Backbone, InfoboardscoreTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({
    	template: InfoboardscoreTmpl,
	});

});
