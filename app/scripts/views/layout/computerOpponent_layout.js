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
			ButtonClose: '.octopus_computer_opponoment_close',
			ButtonAnalyse: '.octopus_computer_opponoment_analyse',
			Compos: '.compo'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonStart': '_onClickButtonStart',
			'click @ui.ButtonClose': '_onClickButtonClose',
			'click @ui.ButtonAnalyse': '_onClickButtonAnalyse',
			'click @ui.Compos': '_onClickCompos'
		},

		initialize: function() {
			console.log("initialize a ComputeropponentLayout Layout");
		},

    	template: ComputeropponentLayoutTmpl,


    	/* Layout sub regions */
    	regions: {},

		_onClickCompos: function (e) {
			this.ui.Compos.removeClass('sel');
			$(e.currentTarget).addClass('sel');
		},

    	_onClickButtonAnalyse: function() {
			var router = new Backbone.Router();
			router.navigate('comp', {trigger: true});
    	},

		_onClickButtonClose: function () {
			this.options.parent.hideComputerOpponent();
		},

		_onClickButtonStart: function () {
			this.options.parent.startCompGame(
			{
				comp: Number(this.ui.Compos.parent().find('.sel').data('id')),
				name: NameGen.compile('m Mi').toString()
			})
		},

		/* on render callback */
		onRender: function() {
		}
	});

});
