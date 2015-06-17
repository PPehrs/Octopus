define([
	'backbone',
	'hbs!tmpl/layout/encounterPanelLayout_tmpl'
],
function( Backbone, EncounterpanellayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			this.model = new Backbone.Model({
				home: {
					name: ''
				},
				guest: {
					name: ''
				}
			});
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			if (!_.isEmpty(octopusStore.home)) {
				this.model.set('home', octopusStore.home);
			}

			if (!_.isEmpty(octopusStore.guest)) {
				this.model.set('guest', octopusStore.guest);
			}
		},

    	template: EncounterpanellayoutTmpl,


    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
