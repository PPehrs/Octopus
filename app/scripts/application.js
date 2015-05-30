define([
	'backbone',
	'communicator'
],

function( Backbone, Communicator ) {
    'use strict';

	var App = new Backbone.Marionette.Application();
	App.addRegions({
  		mainRegion: "#octopus"
	});
	return App;
});
