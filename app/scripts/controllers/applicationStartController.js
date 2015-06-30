define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/homeLayout',
	'../views/item/board/mainMenu'
],
function( Backbone, Marionette, App, HomeLayout, MainMenu ) {
    'use strict';

	return Backbone.Marionette.Controller.extend({

		initialize: function( options ) {
			console.log("initialize a Controller");
			App.mainMenuRegion.show(new MainMenu());
		},

        start: function() {
            console.log("start a Controller");
        },

        showHome: function() {
			console.log("home");
			App.mainRegion.show(new HomeLayout());
        },

		notFound: function() {
			console.log("home");
			App.mainRegion.show(new HomeLayout());
		}
	});

});
