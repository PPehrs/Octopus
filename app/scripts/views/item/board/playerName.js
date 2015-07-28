define([
	'backbone',
	'communicator',
	'hbs!tmpl/item/playerName_tmpl',
	'./dialogPlayer'
],
function( Backbone, Communicator, PlayerNameTmpl, DialogPlayer  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: PlayerNameTmpl,

    	/* ui selector cache */
    	ui: {
			InputPlayerName: '.playerName',
			EditUser: '.editUser'
		},

		/* Ui events hash */
		events: {
			'focusout @ui.InputPlayerName': '_onFocusOutInputPlayerName',
			'click @ui.EditUser': '_onClickEditUser'
		},

		initialize: function () {
			this.model.set('isComp', false);
			_.bindAll(this, '_refreshPlayer');
		},

		_onClickEditUser: function () {
			if(App.module('LoginModule').isLoggedIn) {
				var name = App.module('LoginModule').loggedInUserName();
				App.module('DialogModule').showDialog('Spieler auswählen', DialogPlayer, name, this._refreshPlayer, 'CheckPw');
			} else {
				App.module('DialogModule').showConfirm('Spieler auswählen', DialogPlayer, this._refreshPlayer);
			}
		},

		_refreshPlayer: function (player) {
			this.model.set('name', player.name);
			this.model.set('fkUser', player.fkUser);
			this.model.unset('comp');
			var playerNameModel = this.model.toJSON();
			delete playerNameModel.isPlayerActive;
			Communicator.mediator.trigger('playerName:change:name:direct', playerNameModel);
			this.render();
		},

		_onFocusOutInputPlayerName: function () {
			this.model.set('name', this.ui.InputPlayerName.val());
			var playerNameModel = this.model.toJSON();
			delete playerNameModel.isPlayerActive;
			delete playerNameModel.isComp;
			Communicator.mediator.trigger('playerName:change:name:direct', playerNameModel);
		},

		afterRender: function () {
			var comp = this.model.get('comp');
			if (comp) {
				var blink = this.$('.blink');
				if(blink && blink.length > 0) {
					App.module('CompController').setScore(comp);
				}
			}
		},

		/* on render callback */
		onRender: function() {
			this.ui.InputPlayerName.val(this.model.get('name'));

			var comp = this.model.get('comp');
			if(comp) {
				this.model.set('isComp', true);
			}

			if(App.module('MatchModule').match) {
				var isLeft = this.model.get('isLeft');
				var isPlayerLeftActive = App.module('MatchModule').match.state.isPlayerLeftActive;
				var isPlayerActive = isLeft ? isPlayerLeftActive : !isPlayerLeftActive;
				this.model.set('isPlayerActive', isPlayerActive);
				var _self = this;
				setTimeout(function () {
					_self.afterRender();
				})
			}
		}
	});

});

