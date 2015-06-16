define([
	'backbone',
	'hbs!tmpl/layout/boardPanelLayout_tmpl',
	'./dialogTeam'
],
function( Backbone, BoardpanellayoutTmpl, DialogTeam  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			console.log("initialize a Boardpanellayout Layout");
		},
		
    	template: BoardpanellayoutTmpl,
    	

    	/* Layout sub regions */
    	regions: {},

    	/* ui selector cache */
    	ui: {
			createTeam: '#btnCreateTeam',
			createEncounter: '#btnCreateEncounter',
			addMatch: '#btnAddMatch'
    	},

		/* Ui events hash */
		events: {
			'click @ui.createTeam': '_onClickCreateTeam'
		},

		_onClickCreateTeam: function() {
			App.module('DialogModule').showConfirm('Team anlegen', DialogTeam); //, 'RegisterUser');
		},

		/* on render callback */
		onRender: function() {}
	});

});
