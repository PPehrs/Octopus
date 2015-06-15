define([
	'backbone'
],
function(Backbone) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({

		defaults: {
			name: '',
			username: '',
			email: '',
			pw: ''
		},

		validation: function() {
			return {
				name: {
					required: true,
					msg: 'ein Name muss angegeben werden<br>'
				},
				username: {
					required: true,
					msg: 'ein Benutzername muss angegeben werden<br>'
				},
				email: {
					required: true,
					pattern: 'email',
					msg: 'gültige E-Mail Adresse angeben<br>'
				},
				pw: {
					required: true,
					msg: 'ein Passwort muss angegeben werden<br>'
				}
			}
		}

    });
});
