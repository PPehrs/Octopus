define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'hbs!tmpl/item/dialogEncounter_tmpl',
	'models/encounter'
],
function( Backbone, Stickit, Validation, DialogencounterTmpl, Model  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: DialogencounterTmpl,


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		bindings: {
			'#form__home_teamname': 'home.name',
			'#form__guest_teamname': 'guest.name'
		},

		initialize: function () {
			this.model = new Model({
				uid: octopus.uid
			});
		},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();
		}
	});

});
