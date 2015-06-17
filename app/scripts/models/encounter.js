define([
	'backbone'
],
function( Backbone ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		defaults: {
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
			uid: ''
		},

    });
});
