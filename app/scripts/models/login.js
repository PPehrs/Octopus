define([
	'backbone'
],
function( Backbone ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		defaults: {
			username: '',
			pw: '',
			email: ''
		},

    });
});
