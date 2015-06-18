define([
	'backbone'
],
function( Backbone ) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({
		defaults: {
			n1: '',
			n2: '',
			p1: {
				name: '',
				fkUser: -1,
				legs: 0,
			},
			p2: {
				name: '',
				fkUser: -1,
				legs: 0
			},
			uid: ''
		},

		validation: function() {
			return {
				n1: {
					required: true,
					msg: 'Name des 1. Spielers angeben<br>'
				},
				n2: {
					required: true,
					msg: 'Name des 2. Spielers angeben<br>'
				}
			}
		}

    });
});
