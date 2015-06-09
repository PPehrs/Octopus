define([
	'backbone',
	'hbs!tmpl/layout/homeLayout_tmpl'
],
function( Backbone, HomelayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.Layout.extend({

		initialize: function() {
			console.log("initialize a Homelayout Layout");
		},
		
    	template: HomelayoutTmpl,
    	

    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {
    		buttonStartNewGame: '#btnStartNewGame'
    	},

		/* Ui events hash */
		events: {
			'click @ui.buttonStartNewGame': '_onClickButtonStartNewGame'
		},

		/* on render callback */
		onRender: function() {},

		_onClickButtonStartNewGame: function() {
			var router = new Backbone.Router();
			router.navigate('board', {trigger: true});
		}
	});

});
