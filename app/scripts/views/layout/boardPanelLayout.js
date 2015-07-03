define([
	'backbone',
	'tooltipster',
	'bootbox',
	'communicator',
	'hbs!tmpl/layout/boardPanelLayout_tmpl',
	'./dialogTeam',
	'../item/board/dialogEncounter',
	'../item/board/dialogEncounterMatch',
],
function( Backbone, Tooltip, Bootbox, Communicator, BoardpanellayoutTmpl, DialogTeam, DialogEncounter, DialogEncounterMatch  ) {
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
			addMatch: '#btnAddMatch',
			deleteEncounter:  '#btnDeleteEncounter'
    	},

		/* Ui events hash */
		events: {
			'click @ui.createTeam': '_onClickCreateTeam',
			'click @ui.createEncounter': '_onClickCreateEncounter',
			'click @ui.addMatch': '_onClickAddMatch',
			'click @ui.deleteEncounter': '_onClickDeleteEncounter'
		},

		_onClickAddMatch: function () {
			App.module('DialogModule').showConfirm('Spielpaarung hinzuf&uuml;gen', DialogEncounterMatch, 'DoCallbackDummy');
		},

		_onClickCreateEncounter: function () {
			App.module('DialogModule').showConfirm('Begegnung anlegen', DialogEncounter, 'UpdateOrCreateEncounter');
		},

		_onClickCreateTeam: function() {
			App.module('DialogModule').showConfirm('Team anlegen', DialogTeam, 'NewTeam');
		},

		_onClickDeleteEncounter: function() {
				Bootbox.confirm('Begegnung und Spielpaarungen löschen?', function (result) {
					if (result) {
						var octopusStore = JSON.parse (localStorage.getItem('octopus'));
				    	octopusStore.encounterMatches = [];
				    	octopusStore.activeEncounter = {};
						octopusStore.activeEncounterMatch = {};
				    	localStorage.setItem('octopus', JSON.stringify(octopusStore));
						Communicator.mediator.trigger('dialogEncounter:encounter:confirmed');
						Communicator.mediator.trigger('dialogEncounterMatch:encounter:confirmed');
					}
				});
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
			this.ui.deleteEncounter.tooltipster({
				content: $(
					'<span>Begegnung und Spielpaarungen löschen</span>'
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

