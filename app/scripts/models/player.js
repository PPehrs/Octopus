define([
		'backbone'
	],
	function( Backbone ) {
		'use strict';

		/* Return a model class definition */
		return Backbone.Model.extend({
			defaults: {
				name: '',
				fkUserId: -1,
				fkTeam: -1,
				uid: _.uniqueId('p_')
			},

		});
	});
