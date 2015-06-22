define([
	'backbone',
	'backbone.stickit',
	'hbs!tmpl/item/teamMember_tmpl',
	'models/member'
],
function( Backbone, Stickit, TeammembersTmpl  ) {
    'use strict';

	/* Return a ItemView class definition */
	return Backbone.Marionette.ItemView.extend({

    	template: TeammembersTmpl,

        bindings: {
        	'.form_membername': 'name'
        },

    	/* ui selector cache */
    	ui: {
    		buttonSuccess: '.btn-success'
    	},

		/* Ui events hash */
		events: {
			'click @ui.buttonSuccess': '_onClickButtonSuccess'
		},

		_onClickButtonSuccess: function() {
			var name = this.model.get('name');
			if(name) {
				this.triggerMethod('teamMember:name:confirmed')
			}
		},

		/* on render callback */
		onRender: function() {
			this.stickit();
		}
	});

});
