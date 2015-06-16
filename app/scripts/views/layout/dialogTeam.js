define([
	'backbone',
	'backbone.stickit',
	'hbs!tmpl/layout/dialogTeam_tmpl',
	'../composite/teamMembers',
	'models/team',
	'models/member'
],
function( Backbone, Stickit, DialogteamTmpl, TeamMembers, Team, Member  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		initialize: function() {
			this.model = new Team();
		},
		
    	template: DialogteamTmpl,
    	

    	/* Layout sub regions */
    	regions: {
    		TeamMembersRegion: '#form_teamMembers'
    	},


        bindings: {
        	'#form_teamname': 'name'
        },


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			this.stickit();
			var member = new Member({
					name: '',
					fkUserId: -1
			});
			var members = new Backbone.Collection([member])
			this.TeamMembersRegion.show(new TeamMembers({collection: members}))
		}
	});

});
