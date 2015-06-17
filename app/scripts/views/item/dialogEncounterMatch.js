define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'hbs!tmpl/item/dialogEncounterMatch_tmpl',
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
			'#form__p1_name': 'p1.name',
			'#form__p2_name': 'p2.name'
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
