define([
	'backbone',
	'communicator',
	'hbs!tmpl/item/dialogPlayer_tmpl'
],
function( Backbone, Communicator, DialogencounterTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

		members: [],

    	template: DialogencounterTmpl,


		/* ui selector cache */
		ui: {
			P1Selectpicker: '.form_p1_selectpicker',

			ButtonToggleP1: '.btn-p1-selectpicker',

			P1Toggle: '.p1_toggle',

			P1Name: '#form_p1_name',
			P1Pass: '#form_p1_pass'
		},

		/* Ui events hash */
		events: {
			'click @ui.ButtonToggleP1' : '_onClickButtonToggleP1',

			'change @ui.P1Selectpicker' : '_onClickP1Selectpicker',
		},

		_onClickButtonToggleP1: function () {
			this.ui.P1Toggle.toggle();
		},

		afterConfirm: function (btn) {
			var player = {};
			if(btn === "btn-success") {
				var lm = App.module('LoginModule');
				player.name = lm.loggedInUserName();
				player.fkUser = lm.loggedInUserId();
				player.uid = _.uniqueId('u_');
			} else {
				player.name = this.ui.P1Name.val();
				player.fkUser = '';
				player.uid = _.uniqueId('u_');
				var id = this.model.get('_id');
				if(id) {
					player.name = this.model.get('username');
					player.fkUser = id;
				}
			}

			return player;
		},

		validate: function () {
			var id = this.model.get('_id');
			var pass = this.ui.P1Pass.val();
			var validationText = this.model.validate();
			if(id && !pass) {
				validationText = ['Passwort nicht gesetzt'];
			}
			if(validationText) {
				return validationText;
			}
			this.model.set('pw', pass);
		},


		_onClickP1Selectpicker: function () {
			var _id = this.ui.P1Selectpicker.val();
			var member = _.findWhere(this.members, {_id: _id});
			this.model.set('username', member.username);
			this.model.set('_id', member._id);

			this.ui.P1Toggle.toggle();
			this.ui.P1Name.val(member.username);
		},


		initialize: function () {
			this.model = new Backbone.Model({
				username: '',
				pw: ''
			});

			this.members = [];

			_.bindAll(this, '_onPlayersLoaded');
		},

		/* on render callback */
		onRender: function() {

			Backbone.Validation.bind(this);

			this.ui.P1Selectpicker.selectpicker({
				style: 'btn-info',
				size: 4
			});


			Communicator.mediator.trigger('APP:SOCKET:EMIT', 'get-registered-users', null, this._onPlayersLoaded)
		},

		_onPlayersLoaded: function (players) {
			var self = this;
			this.members = players;
			this.ui.P1Selectpicker.append('<option value="" disabled selected>...einen Spieler auswählen</option>');
			_.each(players, function (player) {
				var htmlval = _.template('<option value="<%= _id %>"><%= username %></option>', { _id: player._id, username: player.username});
				self.ui.P1Selectpicker.append(htmlval);
			})
			this.ui.P1Selectpicker.selectpicker('refresh');
		},
	});

});
