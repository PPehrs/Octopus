define([
	'backbone',
	'backbone.marionette',
],

function( Backbone, Marionette ) {
    'use strict';

	var App = new Backbone.Marionette.Application();
	App.addRegions({
		mainMenuRegion: "#octopus_mainmenu",
  		mainRegion: "#octopus"
	});
	window.App = App;

	return App;
});
