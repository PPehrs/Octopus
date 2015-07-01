define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'hbs!tmpl/item/dialogResult_tmpl'
],
function( Backbone, Stickit, Validation, DialogregisterTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: DialogregisterTmpl,

		bindings: {
			'#form_p1': 'p1',
			'#form_p2': 'p2',
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		afterConfirm: function () {
			this.options.callback(this.model.toJSON());
		},

		validate: function () {
			var validationText = this.model.validate();
			if(validationText) {
				return validationText;
			}
		},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();
		}
	});

});
