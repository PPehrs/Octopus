define([
	'backbone'
],
function( Backbone ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		defaults: {
			name: '',
			captain: '',
			members: []
		},

		validation: function() {
			return {
				name: {
					required: true,
					msg: 'ein Teamname muss angegeben werden<br>'
				},
				captain: {
					required: true,
					msg: 'ein Teamcaptain muss angegeben werden<br>'
				}
			}
		}
    });
});
