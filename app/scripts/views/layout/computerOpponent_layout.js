define([
	'backbone',
	'hbs!tmpl/layout/computerOpponent_layout_tmpl',
	'../../../bower_components/fantasyname/js/namegen'
],
function( Backbone, ComputeropponentLayoutTmpl  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		ui: {
			ButtonStart: '.octopus_computer_opponoment_start',
			ButtonClose: '.octopus_computer_opponoment_close'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickButtonStart',
			'click @ui.ButtonClose': '_onClickButtonClose'
		},

		initialize: function() {
			console.log("initialize a ComputeropponentLayout Layout");
		},

    	template: ComputeropponentLayoutTmpl,


    	/* Layout sub regions */
    	regions: {},

		_onClickButtonClose: function () {
			this.options.parent.hideComputerOpponent();
		},

		_onClickButtonStart: function () {
			this.options.parent.startCompGame(
			{
				comp: 3,
				name: NameGen.compile('m Mi').toString()
			})
		},

		/* on render callback */
		onRender: function() {
		}
	});

});