define([
	'backbone',
	'application',
	'hbs!tmpl/item/mainMenu_tmpl'
],
function( Backbone, App, MainmenueTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		initialize: function() {
			console.log("initialize a Mainmenue ItemView");
		},
		
    	template: MainmenueTmpl,
        

    	/* ui selector cache */
    	ui: {
    		MainMenuStartside: '#mmStartside'
    	},

		/* Ui events hash */
		events: {
			'click @ui.MainMenuStartside': 'onClickMainMenuStartside'
		},


		onClickMainMenuStartside: function() {
			var router = new Backbone.Router();
			router.navigate('', {trigger: true});
		},

		/* on render callback */
		onRender: function() {}
	});

});
