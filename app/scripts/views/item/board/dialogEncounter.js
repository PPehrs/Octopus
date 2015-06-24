define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'communicator',
	'hbs!tmpl/item/dialogEncounter_tmpl',
	'models/encounter'
],
function( Backbone, Stickit, Validation, Communicator, DialogencounterTmpl, Model  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		teams: [],

    	template: DialogencounterTmpl,


		bindings: {
			'#form_home_teamname': 'h',
			'#form_guest_teamname': 'g',
		},

    	/* ui selector cache */
    	ui: {
			GuestSelectpicker: '.form_guest_selectpicker',
			HomeSelectpicker: '.form_home_selectpicker',
			ButtonToggleHome: '.btn-home-selectpicker',
			ButtonToggleGuest: '.btn-guest-selectpicker',
			P1Toggle: '.p1_toggle',
			P2Toggle: '.p2_toggle'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonToggleHome' : '_onClickButtonToggleHome',
			'click @ui.ButtonToggleGuest' : '_onClickButtonToggleGuest',

			'change @ui.GuestSelectpicker' : '_onClickGuestSelectpicker',
			'change @ui.HomeSelectpicker' : '_onClickHomeSelectpicker',
		},


		afterConfirm: function () {
			Communicator.mediator.trigger('dialogEncounter:encounter:confirmed');
		},

		validate: function () {
			var validationText = this.model.validate();
			if(validationText) {
				return validationText;
			}

			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			var teamHome = _.findWhere(this.teams, {_id: this.model.get('home').fkTeam});
			if(_.isEmpty(teamHome)) {
				teamHome = this.model.get('home');
			}
			var teamGuest = _.findWhere(this.teams, {_id: this.model.get('guest').fkTeam});
			if(_.isEmpty(teamGuest)) {
				teamGuest = this.model.get('guest');
			}

			this.model.get('home').name = this.model.get('h');
			this.model.get('guest').name = this.model.get('g');
			this.model.get('home').fkTeam = this.model.get('home').fkTeam;
			this.model.get('guest').fkTeam = this.model.get('guest').fkTeam;
			this.model.unset('h');
			this.model.unset('g');

			octopusStore.activeEncounter = {
				uid: this.model.get('uid'),
				home: teamHome,
				guest: teamGuest
			}

			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		},

		_onClickHomeSelectpicker: function () {
			var _id = this.ui.HomeSelectpicker.val();
			var team = _.findWhere(this.teams, {_id: _id});
			this.model.set('h', team.name);
			var home = {
				name: team.name,
				fkTeam: _id,
				matchesWon: 0
			}
			this.model.set('home', home);
			this.ui.P1Toggle.toggle();
		},

		_onClickGuestSelectpicker: function () {
			var _id = this.ui.GuestSelectpicker.val();
			var team = _.findWhere(this.teams, {_id: _id});
			this.model.set('g', team.name);
			var guest = {
				name: team.name,
				fkTeam: _id,
				matchesWon: 0
			}
			this.model.set('guest', guest);
			this.ui.P2Toggle.toggle();
		},

		_onClickButtonToggleHome: function () {
			this.ui.P1Toggle.toggle();
		},

		_onClickButtonToggleGuest: function () {
			this.ui.P2Toggle.toggle();
		},

		initialize: function () {
			this.model = new Model({
				uid: octopus.uuid()
			});

			_.bindAll(this, '_onTeamsLoaded');
		},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();

			this.ui.GuestSelectpicker.selectpicker({
				style: 'btn-info',
				size: 4
			});

			this.ui.HomeSelectpicker.selectpicker({
				style: 'btn-info',
				size: 4
			});

			Communicator.mediator.trigger('APP:SOCKET:EMIT', 'get-teams', null, this._onTeamsLoaded)
		},

		_onTeamsLoaded: function (teams) {
			this.teams = teams;

			var self = this;

			self.ui.HomeSelectpicker.append('<option value="" disabled selected>...ein Team ausw&auml;hlen</option>');
			self.ui.GuestSelectpicker.append('<option value="" disabled selected>...ein Team ausw&auml;hlen</option>');

			_.each(teams, function (team) {
				var htmlval = _.template('<option value="<%= _id %>" data-subtext="<%= captain %>"><%= name %></option>', { _id: team._id, captain: team.captain, name: team.name});
				self.ui.HomeSelectpicker.append(htmlval);
				self.ui.GuestSelectpicker.append(htmlval);
			})

			self.ui.HomeSelectpicker.selectpicker('refresh');
			self.ui.GuestSelectpicker.selectpicker('refresh');
		}
	});

});
