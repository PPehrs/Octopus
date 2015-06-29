define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'models/login',
	'hbs!tmpl/item/dialogLogin_tmpl'
],
function( Backbone, Stickit, Validation, Model, DialogloginTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({


		initialize: function() {
			this.model = new Model();
		},

    	template: DialogloginTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		bindings: {
			'#form_pw': 'pw',
			'#form_email': 'email',
			'#form_username': 'username'
		},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();
		}
	});

});
