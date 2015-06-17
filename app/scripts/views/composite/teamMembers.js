define([
	'backbone',
	'hbs!tmpl/composite/teamMembers_tmpl',
	'../item/teamMember',
	'models/member'
],
function( Backbone, TeammembersTmpl, TeamMember, Member  ) {
    'use strict';

	/* Return a CompositeView class definition */
	return Backbone.Marionette.CompositeView.extend({

		childEvents: {
			'teamMember:name:confirmed': function(child) {
				var member = new Member({
						name: '',
						fkUserId: -1
				});
				this.collection.add(member);
				this.render();
			}
		},

    	template: TeammembersTmpl,


    	/* ui selector cache */
    	ui: {},

    	childView: TeamMember,

    	/* where are we appending the items views */
    	childViewContainer: "#octopus_teamMembers",

		/* Ui events hash */
		events: {},

		/* on render callback */
		onRender: function() {}
	});

});
