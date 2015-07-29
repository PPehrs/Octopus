define([
	'backbone',
	'communicator',
	'backbone.stickit',
	'backbone.validation',
	'hbs!tmpl/layout/dialogTeam_tmpl',
	'../composite/board/teamMembers',
	'models/team',
	'models/member'
],
function( Backbone, Communicator, Stickit, Validation, DialogteamTmpl, TeamMembers, Team, Member  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({

		teams: null,

		initialize: function() {
			this.model = new Team();
			this.model.set('fkUser', App.module('LoginModule').loggedInUserId());

			_.bindAll(this, '_onTeamsLoaded');
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
    	ui: {
			ButtonToggleTeam: '.btn-team-selectpicker',
			P1Toggle: '.p1_toggle',
			TeamSelectpicker: '.form_team_selectpicker'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonToggleTeam' : '_onClickButtonToggleTeam',
			'change @ui.TeamSelectpicker': '_onClickTeamSelectpicker'
		},

		_onClickButtonToggleTeam: function () {
			this.ui.P1Toggle.toggle();
		},

		_onClickTeamSelectpicker: function () {
			var _id = this.ui.TeamSelectpicker.val();
			var team = _.findWhere(this.teams, {_id: _id});
			this.model.set(team);
			var members = new Backbone.Collection(team.members)
			members.add({
				name: '',
				fkUserId: -1
			})
			this.TeamMembersRegion.show(new TeamMembers({collection: members}))
			this.ui.P1Toggle.toggle();
		},


		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();

			this.ui.TeamSelectpicker.selectpicker({
				style: 'btn-info',
				size: 4
			});

			var member = new Member({
					name: '',
					fkUserId: -1
			});
			var members = new Backbone.Collection([member])
			this.TeamMembersRegion.show(new TeamMembers({collection: members}))

			Communicator.mediator.trigger('APP:SOCKET:EMIT', 'get-teams', {fkUser: App.module('LoginModule').loggedInUserId()}, this._onTeamsLoaded)
		},

		_onTeamsLoaded: function (teams) {
			this.teams = teams;

			var self = this;

			self.ui.TeamSelectpicker.append('<option value="" disabled selected>...ein Team ausw&auml;hlen</option>');

			_.each(teams, function (team) {
				var htmlval = _.template('<option value="<%= _id %>" data-subtext="<%= captain %>"><%= name %></option>', { _id: team._id, captain: team.captain, name: team.name});
				self.ui.TeamSelectpicker.append(htmlval);
			})

			self.ui.TeamSelectpicker.selectpicker('refresh');
		},

		validate: function () {
			var validationText = this.model.validate();
			if(!this.model.get('fkUser') || this.model.get('fkUser') <= 0) {
				validationText = ["Nur eingeloggte Spieler können Teams speichern"];
			}
			if(validationText) {
				return validationText;
			}

			var last = this.TeamMembersRegion.currentView.collection.pop();
			if(last.get('name')) {
				this.TeamMembersRegion.currentView.collection.add(last);
			}

			var members = this.TeamMembersRegion.currentView.collection.toJSON();
			if(!last.get('name')) {
				this.TeamMembersRegion.currentView.collection.add(last);
			}
			var captain = this.model.get('captain');
			debugger
			if (_.isEmpty(_.findWhere(members, {'name': captain}))) {
				members.push({
					name: captain,
					fkUser: -1
				})
			}
			this.model.set('members', members);
		}
	});

});
