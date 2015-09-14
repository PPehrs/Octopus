define([
	'backbone',
	'hbs!tmpl/item/playerStatisticFirst_tmpl'
],
function( Backbone, DialogloginTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({


		initialize: function() {
		},

    	template: DialogloginTmpl,


    	/* ui selector cache */
    	ui: {
			toMatch: '.octopus-a-to-match'
		},

		/* Ui events hash */
		events: {
			'click @ui.toMatch': 'toMatch'
		},

		bindings: {

		},

		toMatch: function (e) {
			var id = $(e.currentTarget).data()['uid']
			var router = new Backbone.Router();
			router.navigate('match/' + id, {trigger: true});
		},

		/* on render callback */
		onRender: function() {
		}
	});

});
