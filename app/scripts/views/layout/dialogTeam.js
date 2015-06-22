define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'hbs!tmpl/layout/dialogTeam_tmpl',
	'../composite/board/teamMembers',
	'models/team',
	'models/member'
],
function( Backbone, Stickit, Validation, DialogteamTmpl, TeamMembers, Team, Member  ) {
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
        	'#form_teamname': 'name',
			'#form_teamcaptain': 'captain'
        },


    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();
			var member = new Member({
					name: '',
					fkUserId: -1
			});
			var members = new Backbone.Collection([member])
			this.TeamMembersRegion.show(new TeamMembers({collection: members}))
		},

		validate: function () {
			var validationText = this.model.validate();
			if(validationText) {
				return validationText;
			}

			var members = this.TeamMembersRegion.currentView.collection.toJSON();
			var captain = this.model.get('captain');
			if (_.isEmpty(_.findWhere(members, {'name': captain}))) {
				members.push({
					name: captain,
					fkUser: this.model.get('fkUser')
				})
			}
			this.model.set('members', members);
		}
	});

});
