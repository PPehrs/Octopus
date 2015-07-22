define([
	'backbone',
	'hbs!tmpl/layout/infoBoard_tmpl',
	'views/composite/match/infoBoardScores'
],
function( Backbone, InfoboardTmpl, InfoBoardScores  ) {
    'use strict';

	/* Return a Layout class definition */
	return Backbone.Marionette.LayoutView.extend({


    	template: InfoboardTmpl,


    	/* Layout sub regions */
    	regions: {
			PlayerLeft: '.infoBoard-p-left',
			PlayerRight: '.infoBoard-p-right'
		},

    	/* ui selector cache */
    	ui: {},

		/* Ui events hash */
		events: {},

		lData: {},
		rData: {},

		initialize: function () {
			var data = this.model.toJSON();
			this.model.set('isLive', false);

			var l = [];
			var r = [];

			if(data.activeLeg) {
				this.model.set('isLive', true);
				l = _.where(data.activeLeg.entries, {isLeft: true});
				r = _.where(data.activeLeg.entries, {isLeft: false});

				if(data.p1) {
					if (data.p1.isLeft) {
						this.lData.player = data.p1;
						this.rData.player = data.p2;
					} else {
						this.lData.player = data.p2;
						this.rData.player = data.p1;
					}
				}

			} else {
				l = _.where(data.entries, {isLeft: true});
				r = _.where(data.entries, {isLeft: false});
			}

			this.lData = {
				entries: l
			};
			this.rData = {
				entries: r
			};
		},

		/* on render callback */
		onRender: function() {
			this.PlayerLeft.show(new InfoBoardScores({
				live: this.model.get('isLive'),
				model: new Backbone.Model(this.lData.player),
				collection: new Backbone.Collection(this.lData.entries)
			}))
			this.PlayerRight.show(new InfoBoardScores({
				live: this.model.get('isLive'),
				model: new Backbone.Model(this.rData.player),
				collection: new Backbone.Collection(this.rData.entries)
			}))
		}
	});

});
