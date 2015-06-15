define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'models/register',
	'hbs!tmpl/item/dialogRegister_tmpl'
],
function( Backbone, Stickit, Validation, Model, DialogregisterTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			this.model = new Model();
		},

    	template: DialogregisterTmpl,

		bindings: {
			'#form_name': 'name',
			'#form_email': 'email',
			'#form_username': 'username',
			'#form_pw': 'pw'
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();
		}
	});

});
