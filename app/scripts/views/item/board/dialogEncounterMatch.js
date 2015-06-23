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

			this.model.get('p1').name = this.model.get('n1');
			this.model.get('p2').name = this.model.get('n2');

			if(!this.model.get('p1').fkTeamPlayer) {
				var uniqueId = _.uniqueId('u_')
				this.model.get('p1').uid = uniqueId;
				this.model.get('p1').fkTeamPlayer = uniqueId;
			}

			if(!this.model.get('p2').fkTeamPlayer) {
				var uniqueId = _.uniqueId('u_')
				this.model.get('p2').uid = uniqueId;
				this.model.get('p2').fkTeamPlayer = uniqueId;
			}

			this.model.unset('n1');
			this.model.unset('n2');

			App.module('EncounterController').add(this.model.toJSON());
		},


		_onClickP1Selectpicker: function () {
			var _id = this.ui.P1Selectpicker.val();
			var member = _.findWhere(this.members, {_id: _id});
			this.model.set('n1', member.name);
			var p1 = {
				name: member.name,
				fkTeamPlayer: _id,
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
				fkTeamPlayer: _id,
			}
			this.model.set('p2', p2);
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

			if(!_.isEmpty(octopusStore.activeEncounter)) {
				self.ui.P1Selectpicker.append('<option value="" disabled selected>...einen Spieler ausw&auml;hlen</option>');
				self.ui.P2Selectpicker.append('<option value="" disabled selected>...einen Spieler ausw&auml;hlen</option>');

				var home = octopusStore.activeEncounter.home;
				var guest = octopusStore.activeEncounter.guest;

				var membersHome = home && !_.isEmpty(home.members) ? home.members : [];
				var membersGuest = guest && !_.isEmpty(guest.members) ? guest.members : [];

				if(!_.isEmpty(membersHome)) {
					_.each(membersHome, function (member) {
						var member = {
							_id: (member._id  || member._id > 0) ? member._id: _.uniqueId('u_'),
							team: this.name,
							name: member.name
						};
						var htmlval = _.template('<option value="<%= _id %>" data-subtext="<%= team %>"><%= name %></option>', member);
						self.members.push(member);
						self.ui.P1Selectpicker.append(htmlval);
						//self.ui.P2Selectpicker.append(htmlval);
					}, home);
				}

				if(!_.isEmpty(membersGuest)) {
					_.each(membersGuest, function (member) {
						var member = {
							_id: (member._id || member._id > 0) ? member._id : _.uniqueId('u_'),
							team: this.name,
							name: member.name
						};
						var htmlval = _.template('<option value="<%= _id %>" data-subtext="<%= team %>"><%= name %></option>', member);
						self.members.push(member);
						//self.ui.P1Selectpicker.append(htmlval);
						self.ui.P2Selectpicker.append(htmlval);
					}, guest);
				}

				self.ui.P1Selectpicker.selectpicker('refresh');
				self.ui.P2Selectpicker.selectpicker('refresh');
			}
		},
	});

});
