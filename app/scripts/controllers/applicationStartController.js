define([
	'backbone',
	'backbone.marionette',
	'application',
<<<<<<< HEAD
	'../views/layout/homeLayout',
	'../views/layout/boardLayout'
],
function( Backbone, Marionette, App, HomeLayout, BoardLayout ) {
=======
	'../views/layout/boardLayout'
],
function( Backbone, Marionette, App, BoardLayout ) {
>>>>>>> 649d8b605c2b67e1996bf857e62456e1942cd3d6
    'use strict';

	return Backbone.Marionette.Controller.extend({

		initialize: function( options ) {
			console.log("initialize a Controller");
		},

        start: function() {
            console.log("start a Controller");
        },		

        showHome: function() {
			console.log("home");
<<<<<<< HEAD
			App.mainRegion.show(new HomeLayout());
=======
			App.mainRegion.show(new BoardLayout())
>>>>>>> 649d8b605c2b67e1996bf857e62456e1942cd3d6
        },

		notFound: function() {
			alert('gift')
		}	        
	});

});
