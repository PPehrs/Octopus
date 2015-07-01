define([
	'backbone'
],
function(Backbone) {
    'use strict';

	/* Return a model class definition */
	return Backbone.Model.extend({

		defaults: {
			p1Name: '',
			p2Name: '',
			p1: '',
			p2: ''
		},

		validation: function() {
			return {
				p1: {
					required: true,
					msg: 'Eingabe fehlt<br>'
				},
				p2: {
					required: true,
					msg: 'Eingabe fehlt<br>'
				}
			}
		}

    });
});
