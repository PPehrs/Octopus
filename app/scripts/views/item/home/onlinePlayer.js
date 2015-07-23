define([
	'backbone',
	'communicator',
	'hbs!tmpl/item/registeredPlayer_tmpl'
],
function( Backbone, Communicator, RegisteredplayerTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: RegisteredplayerTmpl,


    	/* ui selector cache */
    	ui: {
			User: '.octopus_user_profil'
		},

		/* Ui events hash */
		events: {
			'click @ui.User': '_onClickUser'
		},

		_onClickUser: function () {
			Communicator.mediator.trigger('onlinePlayer:selected', this.model.toJSON());
		},

		/* on render callback */
		onRender: function() {}
	});

});
