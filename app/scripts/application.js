define([
	'backbone',
	'backbone.marionette',
],

function( Backbone, Marionette ) {
    'use strict';

	var App = new Backbone.Marionette.Application();
	App.addRegions({
  		mainRegion: "#octopus"
	});
	window.App = App;

	return App;
});
