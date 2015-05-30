define([
	'backbone',
	'backbone.marionette',
	'application',
	'../views/layout/boardLayout'
],
function( Backbone, Marionette, App, BoardLayout ) {
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
			App.mainRegion.show(new BoardLayout())
        },

		notFound: function() {
			alert('gift')
		}	        
	});

});
