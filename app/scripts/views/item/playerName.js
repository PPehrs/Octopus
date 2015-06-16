define([
	'backbone',
	'hbs!tmpl/item/playerName_tmpl'
],
function( Backbone, PlayerNameTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: PlayerNameTmpl,

    	/* ui selector cache */
    	ui: {
			InputPlayerName: '.playerName'
		},

		/* Ui events hash */
		events: {
			'focusout @ui.InputPlayerName': '_onFocusOutInputPlayerName'
		},

		initialize: function() {
 			this.listenTo(this.model, 'change:isPlayerActive', this.onPlayerIsActiveChanged);

			var octopusStore = JSON.parse (localStorage.getItem('octopus'));
			if(octopusStore && !_.isEmpty(octopusStore.players)) {
				var player = _.findWhere(octopusStore.players, {isLeft: this.model.get('isLeft')});
				this.model.set('player', player);
			}
		},

		_onFocusOutInputPlayerName: function () {
			this.setPlayerNameToModel();
			this.triggerMethod('playerName:change:name', this.ui.InputPlayerName.val(), this.model.get('isLeft'));
		},

		onPlayerIsActiveChanged: function() {
			var isPlayerActive = this.model.get('isPlayerActive');
			if(isPlayerActive) {
				this.triggerMethod('playerName:change:activePlayer', this.model.get('isLeft'));
			}
		},

		setPlayerName: function (playerName) {
			this.ui.InputPlayerName.val(playerName);
			this.setPlayerNameToModel();
		},

		setPlayerNameToModel: function () {
			var playerName = this.ui.InputPlayerName.val();
			if(this.model.get('player')) {
				this.model.get('player').name = playerName;
			} else {
				this.model.set('player', {name: playerName, isLeft: this.model.get('isLeft')});
			}
		},

		getPlayer: function () {
			var player = {
				name: this.ui.InputPlayerName.val(),
				isLeft: this.model.get('isLeft')
			};
			this.model.set('player', player);
			return 	player;
		},

		/* on render callback */
		onRender: function() {
			if(this.model.get('player')) {
				var name = this.model.get('player').name;
				this.ui.InputPlayerName.val(name);
			}
		}
	});

});
