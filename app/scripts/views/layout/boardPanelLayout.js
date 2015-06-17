define([
	'backbone',
	'tooltipster',
	'hbs!tmpl/layout/boardPanelLayout_tmpl',
	'./dialogTeam',
	'../item/dialogEncounter',
	'../item/dialogEncounterMatch',
],
function( Backbone, Tooltip, BoardpanellayoutTmpl, DialogTeam, DialogEncounter, DialogEncounterMatch  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

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
			'click @ui.createTeam': '_onClickCreateTeam',
			'click @ui.createEncounter': '_onClickCreateEncounter',
			'click @ui.addMatch': '_onClickAddMatch'
		},

		_onClickAddMatch: function () {
			App.module('DialogModule').showConfirm('Spielpaarung hunzuf&uuml;gen', DialogEncounterMatch, 'NewEncounterMatch');

		},

		_onClickCreateEncounter: function () {
			App.module('DialogModule').showConfirm('Begegnung anlegen', DialogEncounter, 'NewEncounter');
		},

		_onClickCreateTeam: function() {
			App.module('DialogModule').showConfirm('Team anlegen', DialogTeam, 'NewTeam');
		},

		/* on render callback */
		onRender: function() {
			this.ui.createTeam.tooltipster({
				content: $(
					'<span>Ein Team anlegen oder bearbeiten</span>'
				)
			});
			this.ui.createEncounter.tooltipster({
				content: $(
					'<span>Eine Begegnung anlegen</span>'
				)
			});
			this.ui.addMatch.tooltipster({
				content: $(
					'<span>Eine Spielpaarung hinzuf&uuml;gen</span>'
				)
			});
		}
	});

});

