define([
	'backbone',
	'bootbox',
	'hbs!tmpl/layout/homeLayout_tmpl'
],
function( Backbone, Bootbox, HomelayoutTmpl ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Homelayout Layout");
		},

    	template: HomelayoutTmpl,


    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {
    		buttonStartNewGame: '#btnStartNewGame',
    		buttonLoginPlayer: '#btnLoginPlayer',
    		buttonRegisterPlayer: '#btnRegisterPlayer'
    	},

		/* Ui events hash */
		events: {
			'click @ui.buttonStartNewGame': '_onClickButtonStartNewGame',
			'click @ui.buttonLoginPlayer': '_onClickButtonLoginPlayer',
			'click @ui.buttonRegisterPlayer': '_onClickButtonRegisterPlayer'
		},

		/* on render callback */
		onRender: function() {},

		_onClickButtonStartNewGame: function() {
			var router = new Backbone.Router();
			router.navigate('board', {trigger: true});
		},

		_onClickButtonLoginPlayer: function() {
			Bootbox.alert("Hello world!", function() {

			});
		},

		_onClickButtonRegisterPlayer: function() {

		}


	});

});
