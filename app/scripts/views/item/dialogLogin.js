define([
	'backbone',
	'backbone.stickit',
	'models/login',
	'hbs!tmpl/item/dialogLogin_tmpl'
],
function( Backbone, Stickit, Model, DialogloginTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Dialoglogin ItemView");
		},

    	template: DialogloginTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
