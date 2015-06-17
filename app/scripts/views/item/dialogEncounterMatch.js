define([
	'backbone',
	'backbone.stickit',
	'backbone.validation',
	'communicator',
	'hbs!tmpl/item/dialogEncounterMatch_tmpl',
	'models/encounterMatch'
],
function( Backbone, Stickit, Validation, Communicator, DialogencounterTmpl, Model  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		members: [],

    	template: DialogencounterTmpl,


		/* ui selector cache */
		ui: {
			P1Selectpicker: '.form_p1_selectpicker',
			P2Selectpicker: '.form_p2_selectpicker',

			ButtonToggleP1: '.btn-p1-selectpicker',
			ButtonToggleP2: '.btn-p2-selectpicker',

			P1Toggle: '.p1_toggle',
			P2Toggle: '.p2_toggle'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonToggleP1' : '_onClickButtonToggleP1',
			'click @ui.ButtonToggleP2' : '_onClickButtonToggleP2',

			'change @ui.P1Selectpicker' : '_onClickP1Selectpicker',
			'change @ui.P2Selectpicker' : '_onClickP2Selectpicker',
		},

		_onClickButtonToggleP1: function () {
			this.ui.P1Toggle.toggle();
		},

		_onClickButtonToggleP2: function () {
			this.ui.P2Toggle.toggle();
		},


		bindings: {
			'#form_p1_name': 'n1',
			'#form_p2_name': 'n2'
		},

		afterConfirm: function () {
			Communicator.mediator.trigger('dialogEncounterMatch:encounter:confirmed');
		},

		validate: function () {
			var validationText = this.model.validate();
			if(validationText) {
				return validationText;
			}

			this.model.unset('n1');
			this.model.unset('n2');

			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			if(_.isEmpty(octopusStore.encounterMatches)) {
				octopusStore.encounterMatches = [];
			}
			octopusStore.encounterMatches.push({
				uuid: this.model.get('uid'),
				player1: this.model.get('p1'),
				player2: this.model.get('p2'),
			});

			localStorage.setItem('octopus', JSON.stringify(octopusStore));
		},


		_onClickP1Selectpicker: function () {
			var _id = this.ui.P1Selectpicker.val();
			var member = _.findWhere(this.members, {_id: _id});
			this.model.set('n1', member.name);
			var p1 = {
				name: member.name,
				fkUser: _id,
			}
			this.model.set('p1', p1);
			this.ui.P1Toggle.toggle();
		},

		_onClickP2Selectpicker: function () {
			var _id = this.ui.P2Selectpicker.val();
			var member = _.findWhere(this.members, {_id: _id});
			this.model.set('n2', member.name);
			var p2 = {
				name: member.name,
				fkUser: _id,
			}
			this.model.set('p1', p2);
			this.ui.P2Toggle.toggle();
		},

		initialize: function () {
			this.model = new Model({
				uid: octopus.uuid()
			});

			this.members = [];
		},

		/* on render callback */
		onRender: function() {
			Backbone.Validation.bind(this);
			this.stickit();

			this.ui.P1Selectpicker.selectpicker({
				style: 'btn-info',
				size: 4
			});

			this.ui.P2Selectpicker.selectpicker({
				style: 'btn-info',
				size: 4
			});

			this._loadNamesFromStorage();
		},

		_loadNamesFromStorage: function () {
			var self = this;
			var octopusStore = JSON.parse (localStorage.getItem('octopus'));

			self.ui.P1Selectpicker.append('<option value="" disabled selected>...einen Spieler ausw&auml;hlen</option>');
			self.ui.P2Selectpicker.append('<option value="" disabled selected>...einen Spieler ausw&auml;hlen</option>');

			var membersHome = octopusStore.home && !_.isEmpty(octopusStore.home.members) ? octopusStore.home.members : [];
			var membersGuest = octopusStore.guest && !_.isEmpty(octopusStore.guest.members) ? octopusStore.guest.members : [];

			if(!_.isEmpty(membersHome)) {
				_.each(membersHome, function (member) {
					var member = {
						_id: member.fkUser ? member.fkUser : octopus.uuid(),
						team: this.name,
						name: member.name
					};
					var htmlval = _.template('<option value="<%= _id %>" data-subtext="<%= team %>"><%= name %></option>', member);
					self.members.push(member);
					self.ui.P1Selectpicker.append(htmlval);
					self.ui.P2Selectpicker.append(htmlval);
				}, octopusStore.home);
			}

			if(!_.isEmpty(membersGuest)) {
				_.each(membersGuest, function (member) {
					var member = {
						_id: member.fkUser ? member.fkUser : octopus.uuid(),
						team: this.name,
						name: member.name
					};
					var htmlval = _.template('<option value="<%= _id %>" data-subtext="<%= team %>"><%= name %></option>', member);
					self.members.push(member);
					self.ui.P1Selectpicker.append(htmlval);
					self.ui.P2Selectpicker.append(htmlval);
				}, octopusStore.guest);
			}

			self.ui.P1Selectpicker.selectpicker('refresh');
			self.ui.P2Selectpicker.selectpicker('refresh');

		},
	});

});
