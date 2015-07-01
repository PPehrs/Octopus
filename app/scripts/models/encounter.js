define([
	'backbone'
],
function( Backbone ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		defaults: {
			h: '',
			g: '',
			home: {
				name: '',
				fkTeam: -1,
				matchesWon: 0
			},
			guest: {
				name: '',
				fkTeam: -1,
				matchesWon: 0
			},
			uid: '',
			description: ''
		},

		validation: function() {
			return {
				h: {
					required: true,
					msg: 'Name des Heim-Teams angeben<br>'
				},
				g: {
					required: true,
					msg: 'Name des Gast-Teams angeben<br>'
				}
			}
		}
    });
});
